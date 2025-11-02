<script setup lang="ts">
import { ref, watch } from 'vue';

import type { INewTableRow } from '../../components/NewTable/components/NewTableRow/types/NewTableRowTypes';
import type { INewMenuItem } from '../../components/NewContextMenu/types';
import type { INewTableRowNativeEvent } from '../../components/NewTable/types/NewTableEventTypes';
import type { ILocalNewTableRow } from './testdata/testData';
import type { INewTableFilters } from '../../components/NewTable/types/NewTableFilterTypes';
import type { ITestRangeDate } from '../../components/FilterComponents/components/types';

import { useTestPage1NewReestrInitData } from './composables/TestPage1NewReestrInitData';
import { useTestPage1NewReestrChangeRowParentId } from './composables/TestPage1NewReestrChangeRowParentId';

import { findParentRowsById } from '../../helpers/finders';
import { useTestPage1NewReestrActions } from './composables/TestPage1NewReestrActions';
import { NEW_TABLE_STANDART_ROW_MODES } from '../../components/NewTable/constants/standartRowModes';
import { calcParentSums, calcTotalOwnSums } from '../../helpers/calacSums';
import { columnsToCalc } from './testdata/testColumns';
import { integerToRoman } from '../../helpers/integerToRoman';

import NewReestr from '../../components/NewReestr/NewReestr.vue';
import NewReestrChangeRowParentDialog from '../../components/NewReestr/components/NewReestrChangeRowParentDialog/NewReestrChangeRowParentDialog.vue';
import NewSplitter from '../../components/NewSplitter/NewSplitter.vue';
import NewReestrSideMenuDateFilter from './components/NewReestrSideMenuDateFilter/NewReestrSideMenuDateFilter.vue';
import NewReestrSideMenuSumms from './components/NewReestrSideMenuSumms/NewReestrSideMenuSumms.vue';

interface ITestPage1NewReestrSideMenuSubmitEvent {
  name: string;
  value?: unknown;
  payload?: unknown;
}

const newReestrRef = ref<typeof NewReestr>();

const sideMenuComponents = ref<Record<string, { isShown: boolean, payload: unknown }>>({});

const mainReestr = useTestPage1NewReestrInitData();

const relativeReestr1 = useTestPage1NewReestrInitData(1, 2, 3);

const {
  activeDestinationRowId,
  isChangeRowParentDialogShown,
  activeSourceRow,
  onChangeRowParentId,
} = useTestPage1NewReestrChangeRowParentId(
  () => mainReestr.data.value
);

const {
  selectedRow,
  onSave,
  onDelete,
  onRowAction,
  onChangeCellValue,
} = useTestPage1NewReestrActions(
  () => mainReestr.data.value,
  setRow,
  newReestrRef,
);

watch(
  () => selectedRow.value,
  (newSelectedRow) => {
    relativeReestr1.initData();
    if (newSelectedRow) {
      console.log('Selected row changed:', newSelectedRow);
    }
  }
);

/**
 * МЕНЯЕТ ДАННЫЕ
 * @param row строка, которую нужно обновить в данных
 */
function setRow(row: INewTableRow) {
  const parenRows = findParentRowsById(row.data.id, mainReestr.data.value);

  if (!parenRows) {
    return;
  }

  parenRows?.forEach((r, index) => {
    if (r.data.id === row.data.id) {
      parenRows[index] = row;
    }
  });
}

function onSelectContextMenuItem(menuItem: INewMenuItem) {
  const payload: INewTableRowNativeEvent = menuItem.payload as INewTableRowNativeEvent;

  switch (menuItem.actionName) {
    case 'edit-row':
      newReestrRef.value.switchOnModeForRow(NEW_TABLE_STANDART_ROW_MODES.EDIT, payload.row);
      break;
    case 'save-row':
      calcTotalOwnSums(payload.row as ILocalNewTableRow);
      onSave(payload.row);
      calcParentSums(payload.row, mainReestr.data.value, columnsToCalc);
      // TODO использовать готовую функцию из NewTableWrapper onAction
      // её нужно вынести в хелпер
      newReestrRef.value.switchOffModeForRow(NEW_TABLE_STANDART_ROW_MODES.EDIT, payload.row);
      newReestrRef.value?.deleteChangedRow(payload.row.data.id);
      break;
    case 'delete-row':
      onDelete({ name: 'delete', row: payload.row });
      break;
    case 'cell-info':
      const strData = payload.row.data[payload.header.key] as string;
      alert(`${payload.row.data.id} - ${payload.header.key} => ${String(strData)}`)
      break;
    case 'change-row-parent':
      activeSourceRow.value = payload.row;
      activeDestinationRowId.value = null;
      isChangeRowParentDialogShown.value = true;
      break;
    case 'date-filter':
    case 'summs':
      sideMenuComponents.value = {
        ...sideMenuComponents.value,
        [menuItem.actionName]: {
          isShown: true,
          payload: menuItem.payload,
        },
      };
  }
}

function onSelectSideMenuItem(menuItem: INewMenuItem) {
  switch (menuItem.actionName) {
    case 'date-filter':
    case 'summs':
      sideMenuComponents.value = {
        ...sideMenuComponents.value,
        [menuItem.actionName]: {
          isShown: true,
          payload: menuItem.payload,
        },
      };
  }
}

function onNewReestrSideMenuDateFilterSubmit(
  { name, value }: ITestPage1NewReestrSideMenuSubmitEvent,
) {
  mainReestr.filters.value['date'].currentValue = { date1: value, date2: value };

  mainReestr.filters.value = {
    ...mainReestr.filters.value,
    ['date']: {
      ...mainReestr.filters.value['date'],
      currentValue: { date1: value, date2: value },
    }
  };

  sideMenuComponents.value[name].isShown = false
}

function onNewReestrSideMenuSummsSubmit(
  { name, value }: ITestPage1NewReestrSideMenuSubmitEvent,
) {
  sideMenuComponents.value[name].isShown = false
  console.log('[onNewReestrSideMenuSummsSubmit]', value);
}

function onChangeFilters(changedFilters: INewTableFilters) {
  mainReestr.filters.value = changedFilters;
}
</script>

<template>
  <div class="test-page1">
    <div class="test-page1__actions">
      <button @click="mainReestr.initData">
        Init Data
      </button>
    </div>
    <NewSplitter
      variant="red"
      class="test-page1__splitter-wrapper"
    >
      <template #div1>
        <NewReestr
          ref="newReestrRef"
          class="test-page1__new-reestr"
          :initial-data="mainReestr.data.value"
          :initial-columns="mainReestr.columns.value"
          :initial-columns-settings="mainReestr.columnsSettings.value"
          :initial-filters="mainReestr.filters.value"
          :initial-sorts="mainReestr.sorts.value"
          :initial-actions-change-modes="mainReestr.actionsChangeModes.value"
          :initial-actions="mainReestr.actions.value"
          :initial-context-menu-items="mainReestr.contextMenuItems.value"
          :side-menu-items="mainReestr.sideMenuItems.value"
          :isNumberColumnShown="true"
          :isCheckboxColumnShown="true"
          :isExpandColumnShown="true"
          :common-meta="{
            class: {
              stage: '--stage',
              subStage: '--sub-stage',
              task: '--task',
            }
          }"
          @row-action="onRowAction"
          @change:cell-value="onChangeCellValue"
          @select:context-menu-item="onSelectContextMenuItem"
          @select:side-menu-item="onSelectSideMenuItem"
          @change:filters="onChangeFilters"
        >
          <template v-slot:cell[number]="idSlotProps">
            <span style="color: red;">[{{ integerToRoman(idSlotProps.rowNumber) }}]</span>
          </template>

          <template v-slot:cell[name]="nameSlotProps">
            <span style="color: blue;">{{ nameSlotProps.value }}</span>
          </template>

          <template #before-side-menu>
            <NewReestrSideMenuDateFilter
              v-if="!!sideMenuComponents['date-filter']?.isShown"
              :payload="sideMenuComponents['date-filter'].payload"
              :date="(mainReestr.filters.value['date'].currentValue as ITestRangeDate).date1"
              @submit="onNewReestrSideMenuDateFilterSubmit({
                ...$event,
                name: 'date-filter',
              })"
              @close="sideMenuComponents['date-filter'].isShown = false"
            />

            <NewReestrSideMenuSumms
              v-if="!!sideMenuComponents['summs']?.isShown"
              :data="mainReestr.data.value as ILocalNewTableRow[]"
              :payload="sideMenuComponents['summs'].payload"
              @submit="onNewReestrSideMenuSummsSubmit({
                ...$event,
                name: 'summs',
              })"
              @close="sideMenuComponents['summs'].isShown = false"
            />
          </template>
        </NewReestr>
      </template>

      <template #div2>
        <NewReestr
          ref="newReestrRef"
          class="test-page1__new-reestr"
          :initial-data="relativeReestr1.data.value"
          :initial-columns="relativeReestr1.columns.value"
          :initial-columns-settings="relativeReestr1.columnsSettings.value"
          :initial-filters="relativeReestr1.filters.value"
          :initial-sorts="relativeReestr1.sorts.value"
          :initial-actions-change-modes="relativeReestr1.actionsChangeModes.value"
          :initial-actions="relativeReestr1.actions.value"
          :initial-context-menu-items="relativeReestr1.contextMenuItems.value"
          :isNumberColumnShown="true"
          :isCheckboxColumnShown="true"
          :isExpandColumnShown="true"
          :common-meta="{
            class: {
              stage: '--stage',
              subStage: '--sub-stage',
              task: '--task',
            }
          }"
          @row-action="onRowAction"
          @change:cell-value="onChangeCellValue"
          @select:context-menu-item="onSelectContextMenuItem"
          @select:side-menu-item="onSelectSideMenuItem"
          @change:filters="onChangeFilters"
        >
        </NewReestr>
      </template>
    </NewSplitter>

    <NewReestrChangeRowParentDialog
      v-if="isChangeRowParentDialogShown"
      :activeSourceRow="activeSourceRow"
      @close="isChangeRowParentDialogShown = false"
      @change:destination-row-id="onChangeRowParentId"
    />
  </div>
</template>

<style scoped>
.test-page1 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 16px;
  box-sizing: border-box;
  padding: 12px;
  background-color: #777;
  align-items: stretch;
  justify-content: space-between;
}

.test-page1__actions {
  border-radius: 8px;
  background-color: #eee;
  width: 100%;
  text-align: center;
  padding: 8px;
  box-sizing: border-box;

  flex: 0 0;
}

.test-page1__splitter-wrapper {
  width: 100%;
  flex: 1 1;
  min-height: 0;
  height: 100%;
}

.test-page1__new-reestr {
  width: 100%;
  height: 100%;
}

:deep() .--stage {
  background-color: var(--app-row-stage-bg) !important;
}

:deep() .--sub-stage {
  background-color: var(--app-row-substage-bg) !important;
}

:deep() .--task {
  background-color: var(--app-row-task-bg) !important;
}

/* так можно переопределять стили */
:deep(.new-table .new-table__number-cell) {
  width: 100px !important;
  min-width: 100px !important;
  max-width: 100px !important;
}

:deep(.new-table .new-table__header__cell .new-table__header__cell__filter__icon.--active) {
  color: red;
}

dialog {
  top: 50%;
  z-index: 100;
  background-color: #eee;
  border: none;
  border-radius: 8px;
  box-shadow: 0 0 5px 1px #777;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

:deep(dialog p) {
  padding: 0;
  margin: 0;
}

:deep(dialog form) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(dialog form .dialog-buttons) {
  display: flex;
  gap: 8px;
}
</style>