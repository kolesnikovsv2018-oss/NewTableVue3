<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

import type { ILocalNewTableRow } from './testdata/testNewReestrData';
import type { INewTableFilters } from '../../components/NewTable/types/NewTableFilterTypes';
import type { ITestRangeDate } from '../../components/FilterComponents/components/types';
import type { INewTableColumnSettings } from '../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes';
import type { IUseMainNewReestr } from './composables/main/MainNewReestr'

import { useMainNewReestr } from './composables/main/MainNewReestr';
import { useMainNewReestrOnRowActions } from './composables/main/MainNewReestrOnRowActions';
import { useTestPage1Settings } from './composables/TestPage1Settings';
import { useMainNewReestrSideMenu } from './composables/main/MainNewReestrSideMenu';
import { useMainNewReestrContextMenu } from './composables/main/MainNewReestrContextMenu';
import { useSub1NewReestr } from './composables/sub1/Sub1NewReestr';
import { useSub1NewReestrOnRowActions } from './composables/sub1/Sub1NewReestrOnRowActions';

import { integerToRoman } from '../../helpers/integerToRoman';

import NewReestr from '../../components/NewReestr/NewReestr.vue';
import NewReestrChangeRowParentDialog from '../../components/NewReestr/components/NewReestrChangeRowParentDialog/NewReestrChangeRowParentDialog.vue';
import NewSplitter from '../../components/NewSplitter/NewSplitter.vue';
import NewReestrSideMenuDateFilter from './components/NewReestrSideMenuDateFilter/NewReestrSideMenuDateFilter.vue';
import NewReestrSideMenuSumms from './components/NewReestrSideMenuSumms/NewReestrSideMenuSumms.vue';

const newMainReestrRef = ref<typeof NewReestr>();

const newSubReestrRef = ref<typeof NewReestr>();

const mainReestr = useMainNewReestr('mainReestr', 10000, 5, 7, 14);

const relativeReestr1 = useSub1NewReestr('relativeReestr1', 1, 2, 3, 7);

const mainNewReestrOnRowActionsComposable = useMainNewReestrOnRowActions(
  mainReestr,
  () => newMainReestrRef.value,
);

const relativeNewReestrOnRowActionsComposable = useSub1NewReestrOnRowActions(
  relativeReestr1,
  () => newSubReestrRef.value,
);

const mainNewReestrContextMenuComposable = useMainNewReestrContextMenu(
  () => newMainReestrRef.value,
  mainNewReestrOnRowActionsComposable,
);

const relativeNewReestrContextMenuComposable = useMainNewReestrContextMenu(
  () => newSubReestrRef.value,
  relativeNewReestrOnRowActionsComposable,
);

const {
  sideMenuComponentSettings,
  onSelectSideMenuItem,
  onNewReestrSideMenuDateFilterSubmit,
  onNewReestrSideMenuSummsSubmit,
} = useMainNewReestrSideMenu(
  mainReestr,
);

const {
  splitterDiv1Height,
  savePageSettingsToLocalStorage,
  loadPageSettingsFromLocalStorage
} = useTestPage1Settings(
  'TestPage1',
);

watch(
  () => mainNewReestrOnRowActionsComposable.selectedRow.value,
  async () => {
    await relativeReestr1.initData();
  }
);






function onUpdateDiv1Size(newSize: number) {
  splitterDiv1Height.value = newSize;
  savePageSettingsToLocalStorage();
}

onMounted(async () => {
  await mainReestr.initData();

  loadPageSettingsFromLocalStorage();

  mainReestr.loadReestrSettingsFromLocalStorage();
  relativeReestr1.loadReestrSettingsFromLocalStorage();
});
</script>

<template>
  <div class="test-page1">
    <NewSplitter
      color="green"
      :minDivSize="200"
      :currentDiv1Size="splitterDiv1Height"
      class="test-page1__splitter-wrapper"
      @update:div1-size="onUpdateDiv1Size"
    >
      <template #div1>
        <NewReestr
          ref="newMainReestrRef"
          class="test-page1__new-reestr"
          :initial-data="mainReestr.data.value"
          :initial-columns="mainReestr.columns.value"
          :initialColumnSettings="mainReestr.columnSettings.value"
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
          @change:row-count="mainReestr.onChangeRowCount($event)"
          @row-action="mainNewReestrOnRowActionsComposable.onRowAction"
          @change:cell-value="mainNewReestrOnRowActionsComposable.onChangeCellValue"
          @select:context-menu-item="mainNewReestrContextMenuComposable.onSelectContextMenuItem"
          @select:side-menu-item="onSelectSideMenuItem"
          @change:filters="mainReestr.onChangeFilters($event)"
          @change:column-settings="mainReestr.onChangeColumnsettings($event)"
          @keyup="mainNewReestrOnRowActionsComposable.onRowAction"
        >
          <template v-slot:cell[number]="idSlotProps">
            <span style="color: red;">[{{ integerToRoman(idSlotProps.rowNumber) }}]</span>
          </template>

          <template v-slot:cell[name]="nameSlotProps">
            <span style="color: blue;">{{ nameSlotProps.value }}</span>
          </template>

          <template #before-side-menu>
            <NewReestrSideMenuDateFilter
              v-if="!!sideMenuComponentSettings['date-filter']?.isShown"
              :payload="sideMenuComponentSettings['date-filter'].payload"
              :date="(mainReestr.filters.value['date'].currentValue as ITestRangeDate).date1"
              @submit="onNewReestrSideMenuDateFilterSubmit({
                ...$event,
                name: 'date-filter',
              })"
              @close="sideMenuComponentSettings['date-filter'].isShown = false"
            />

            <NewReestrSideMenuSumms
              v-if="!!sideMenuComponentSettings['summs']?.isShown"
              :data="mainReestr.data.value as ILocalNewTableRow[]"
              :payload="sideMenuComponentSettings['summs'].payload"
              @submit="onNewReestrSideMenuSummsSubmit({
                ...$event,
                name: 'summs',
              })"
              @close="sideMenuComponentSettings['summs'].isShown = false"
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
          :initialColumnSettings="relativeReestr1.columnSettings.value"
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
          @change:row-count="relativeReestr1.onChangeRowCount($event)"
          @row-action="relativeNewReestrOnRowActionsComposable.onRowAction"
          @change:cell-value="relativeNewReestrOnRowActionsComposable.onChangeCellValue"
          @select:context-menu-item="relativeNewReestrContextMenuComposable.onSelectContextMenuItem"
          @change:filters="relativeReestr1.onChangeFilters($event)"
          @change:column-settings="relativeReestr1.onChangeColumnsettings($event)"
        >
        </NewReestr>
      </template>
    </NewSplitter>

    <NewReestrChangeRowParentDialog
      v-if="!!mainNewReestrOnRowActionsComposable.activeRowForChangeParent.value"
      :activeSourceRow="mainNewReestrOnRowActionsComposable.activeRowForChangeParent.value"
      @close="mainNewReestrOnRowActionsComposable.activeRowForChangeParent.value = null"
      @change:destination-row-id="mainNewReestrOnRowActionsComposable.onChangeRowParentId"
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