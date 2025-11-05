<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

import type { ILocalNewTableRow } from './testdata/testNewReestrData';
import type { ITestRangeDate } from '../../components/FilterComponents/components/types';

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

const mainReestrComposable = useMainNewReestr('mainReestr', 10000, 5, 7, 14);

const sub1ReestrComposable = useSub1NewReestr('relativeReestr1', 1, 2, 3, 7);

const mainNewReestrOnRowActionsComposable = useMainNewReestrOnRowActions(
  mainReestrComposable,
  () => newMainReestrRef.value,
);

const sub1NewReestrOnRowActionsComposable = useSub1NewReestrOnRowActions(
  sub1ReestrComposable,
  () => newSubReestrRef.value,
);

const mainNewReestrContextMenuComposable = useMainNewReestrContextMenu(
  () => newMainReestrRef.value,
  mainNewReestrOnRowActionsComposable,
);

const sub1NewReestrContextMenuComposable = useMainNewReestrContextMenu(
  () => newSubReestrRef.value,
  sub1NewReestrOnRowActionsComposable,
);

const {
  sideMenuComponentSettings,
  onSelectSideMenuItem,
  onNewReestrSideMenuDateFilterSubmit,
  onNewReestrSideMenuSummsSubmit,
} = useMainNewReestrSideMenu(
  mainReestrComposable,
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
    await sub1ReestrComposable.initData();
  }
);

function onUpdateDiv1Size(newSize: number) {
  splitterDiv1Height.value = newSize;
  savePageSettingsToLocalStorage();
}

onMounted(async () => {
  await mainReestrComposable.initData();

  loadPageSettingsFromLocalStorage();

  mainReestrComposable.loadReestrSettingsFromLocalStorage();
  sub1ReestrComposable.loadReestrSettingsFromLocalStorage();
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
          :initial-data="mainReestrComposable.data.value"
          :initial-columns="mainReestrComposable.columns.value"
          :initialColumnSettings="mainReestrComposable.columnSettings.value"
          :initial-filters="mainReestrComposable.filters.value"
          :initial-sorts="mainReestrComposable.sorts.value"
          :initial-actions-change-modes="mainReestrComposable.actionsChangeModes.value"
          :initial-actions="mainReestrComposable.actions.value"
          :initial-context-menu-items="mainReestrComposable.contextMenuItems.value"
          :side-menu-items="mainReestrComposable.sideMenuItems.value"
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
          :row-count="mainReestrComposable.rowCount.value"
          @change:row-count="mainReestrComposable.onChangeRowCount($event)"
          @row-action="mainNewReestrOnRowActionsComposable.onRowAction"
          @change:cell-value="mainNewReestrOnRowActionsComposable.onChangeCellValue"
          @select:context-menu-item="mainNewReestrContextMenuComposable.onSelectContextMenuItem"
          @select:side-menu-item="onSelectSideMenuItem"
          @change:filters="mainReestrComposable.onChangeFilters($event)"
          @change:column-settings="mainReestrComposable.onChangeColumnsettings($event)"
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
              :date="(mainReestrComposable.filters.value['date'].currentValue as ITestRangeDate).date1"
              @submit="onNewReestrSideMenuDateFilterSubmit({
                ...$event,
                name: 'date-filter',
              })"
              @close="sideMenuComponentSettings['date-filter'].isShown = false"
            />

            <NewReestrSideMenuSumms
              v-if="!!sideMenuComponentSettings['summs']?.isShown"
              :data="mainReestrComposable.data.value as ILocalNewTableRow[]"
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
          :initial-data="sub1ReestrComposable.data.value"
          :initial-columns="sub1ReestrComposable.columns.value"
          :initialColumnSettings="sub1ReestrComposable.columnSettings.value"
          :initial-filters="sub1ReestrComposable.filters.value"
          :initial-sorts="sub1ReestrComposable.sorts.value"
          :initial-actions-change-modes="sub1ReestrComposable.actionsChangeModes.value"
          :initial-actions="sub1ReestrComposable.actions.value"
          :initial-context-menu-items="sub1ReestrComposable.contextMenuItems.value"
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
          :row-count="sub1ReestrComposable.rowCount.value"
          @change:row-count="sub1ReestrComposable.onChangeRowCount($event)"
          @row-action="sub1NewReestrOnRowActionsComposable.onRowAction"
          @change:cell-value="sub1NewReestrOnRowActionsComposable.onChangeCellValue"
          @select:context-menu-item="sub1NewReestrContextMenuComposable.onSelectContextMenuItem"
          @change:filters="sub1ReestrComposable.onChangeFilters($event)"
          @change:column-settings="sub1ReestrComposable.onChangeColumnsettings($event)"
          @keyup="sub1NewReestrOnRowActionsComposable.onRowAction"
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