<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

import type { INewMenuItem } from '../../components/NewContextMenu/types';
import type { INewTableRowActionEvent } from '../../components/NewTable/types/NewTableEventTypes';
import type { ILocalNewTableRow } from './testdata/testData';
import type { INewTableFilters } from '../../components/NewTable/types/NewTableFilterTypes';
import type { ITestRangeDate } from '../../components/FilterComponents/components/types';

import { useTestPage1NewReestrInitData } from './composables/TestPage1NewReestrInitData';
import { useTestPage1NewReestrChangeRowParentId } from './composables/TestPage1NewReestrChangeRowParentId';
import { useTestPage1NewReestrActions } from './composables/TestPage1NewReestrActions';

import { NEW_TABLE_STANDART_ROW_MODES } from '../../components/NewTable/constants/standartRowModes';
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

const newMainReestrRef = ref<typeof NewReestr>();

const sideMenuComponents = ref<Record<string, { isShown: boolean, payload: unknown }>>({});

const mainReestr = useTestPage1NewReestrInitData(10000, 5, 7, 10);

const relativeReestr1 = useTestPage1NewReestrInitData(1, 2, 3, 5);

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
  newMainReestrRef,
);

watch(
  () => selectedRow.value,
  async () => {
    await relativeReestr1.initData();
  }
);

function onSelectContextMenuItem(menuItem: INewMenuItem) {
  const payload: INewTableRowActionEvent = menuItem.payload;

  switch (menuItem.actionName) {
    case 'edit-row':
      newMainReestrRef.value.switchOnModeForRow(NEW_TABLE_STANDART_ROW_MODES.EDIT, payload.row);
      break;
    case 'save-row':
      onSave({ name: 'save', row: payload.row });
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
  { name }: ITestPage1NewReestrSideMenuSubmitEvent,
) {
  sideMenuComponents.value[name].isShown = false
}

function onChangeFilters(changedFilters: INewTableFilters) {
  mainReestr.filters.value = changedFilters;
}
onMounted(() => {
  void mainReestr.initData();
});
</script>

<template>
  <div class="test-page1">
    <NewSplitter
      variant="red"
      class="test-page1__splitter-wrapper"
    >
      <template #div1>
        <NewReestr
          ref="newMainReestrRef"
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
          :row-count="mainReestr.rowCount.value"
          @change:row-count="(event: number) => mainReestr.rowCount.value = event"
          @row-action="onRowAction"
          @change:cell-value="onChangeCellValue"
          @select:context-menu-item="onSelectContextMenuItem"
          @select:side-menu-item="onSelectSideMenuItem"
          @change:filters="onChangeFilters"
          @keyup="onRowAction"
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
          ref="newSubReestrRef"
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
          :row-count="relativeReestr1.rowCount.value"
          @change:row-count="(event: number) => relativeReestr1.rowCount.value = event"
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
  gap: var(--app-gap);
  box-sizing: border-box;
  padding: var(--app-content-padding);
  background-color: var(--app-body-bg);
  align-items: stretch;
  justify-content: space-between;
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
  z-index: var(--app-z-dialog);
  background-color: var(--app-dialog-bg);
  border: 1px solid var(--app-panel-border);
  border-radius: var(--app-button-radius);
  box-shadow: var(--app-dialog-shadow);
  color: var(--app-text-primary);
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
}

:deep(dialog p) {
  padding: 0;
  margin: 0;
}

:deep(dialog form) {
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
}

:deep(dialog form .dialog-buttons) {
  display: flex;
  gap: 8px;
}
</style>