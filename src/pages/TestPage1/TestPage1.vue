<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

import type { ILocalNewTableRow } from './testdata/testNewReestrData';
import type { ITestRangeDate } from '../../components/FilterComponents/components/types';

import { useMainNewReestr } from './composables/main/MainNewReestr';
import { useTestPage1Settings } from './composables/TestPage1Settings';
import { useSub1NewReestr } from './composables/sub1/Sub1NewReestr';

import { integerToRoman } from '../../helpers/integerToRoman';

import NewReestr from '../../components/NewReestr/NewReestr.vue';
import NewReestrChangeRowParentDialog from '../../components/NewReestr/components/NewReestrChangeRowParentDialog/NewReestrChangeRowParentDialog.vue';
import NewSplitter from '../../components/NewSplitter/NewSplitter.vue';
import NewReestrSideMenuDateFilter from './components/NewReestrSideMenuDateFilter/NewReestrSideMenuDateFilter.vue';
import NewReestrSideMenuSumms from './components/NewReestrSideMenuSumms/NewReestrSideMenuSumms.vue';

const newMainReestrRef = ref<typeof NewReestr>();

const newSubReestrRef = ref<typeof NewReestr>();

const mainReestrComposable = useMainNewReestr(
  'mainReestr',
  () => newMainReestrRef.value,
  10000, 5, 7, 15
);

const sub1ReestrComposable = useSub1NewReestr(
  'relativeReestr1',
  () => newSubReestrRef.value,
  1, 2, 3, 4
);

const sub2ReestrComposable = useSub1NewReestr(
  'relativeReestr2',
  () => newSubReestrRef.value,
  1, 3, 4, 5
);

const sub3ReestrComposable = useSub1NewReestr(
  'relativeReestr3',
  () => newSubReestrRef.value,
  1, 4, 5, 6
);

const {
  splitterDiv1Height,
  savePageSettingsToLocalStorage,
  loadPageSettingsFromLocalStorage
} = useTestPage1Settings(
  'TestPage1',
);

const activeReestr = ref<ReturnType<typeof useSub1NewReestr>>(sub1ReestrComposable);

watch(
  () => mainReestrComposable.selectedRow.value,
  async () => {
    await activeReestr.value.initData();
  }
);

watch(
  () => activeReestr.value,
  async () => {
    if (!mainReestrComposable.selectedRow.value) {
      return;
    }
    await activeReestr.value.initData();
  }
);

function onUpdateDiv1Size(newSize: number) {
  splitterDiv1Height.value = newSize;
  savePageSettingsToLocalStorage();
}

function isActive(reestrComposable: ReturnType<typeof useSub1NewReestr>) {
  return activeReestr.value.reestrName === reestrComposable.reestrName;
}

function setActiveReestr(reestrComposable: ReturnType<typeof useSub1NewReestr>) {
  activeReestr.value = reestrComposable;
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
          :id-fields="mainReestrComposable.idFields.value"
          @change:row-count="mainReestrComposable.onChangeRowCount($event)"
          @row-action="mainReestrComposable.onRowAction"
          @change:cell-value="mainReestrComposable.onChangeCellValue"
          @select:context-menu-item="mainReestrComposable.onSelectContextMenuItem"
          @select:side-menu-item="mainReestrComposable.onSelectSideMenuItem"
          @change:filters="mainReestrComposable.onChangeFilters($event)"
          @change:column-settings="mainReestrComposable.onChangeColumnsettings($event)"
          @keyup="mainReestrComposable.onRowAction"
        >
          <template v-slot:cell[number]="idSlotProps">
            <span style="color: red;">[{{ integerToRoman(idSlotProps.rowNumber) }}]</span>
          </template>

          <template v-slot:cell[name]="nameSlotProps">
            <span style="color: blue;">{{ nameSlotProps.value }}</span>
          </template>

          <template #before-side-menu>
            <NewReestrSideMenuDateFilter
              v-if="!!mainReestrComposable.sideMenuComponentSettings.value['date-filter']?.isShown"
              :payload="mainReestrComposable.sideMenuComponentSettings.value['date-filter'].payload"
              :date="(mainReestrComposable.filters.value['date'].currentValue as ITestRangeDate).date1"
              @submit="mainReestrComposable.onNewReestrSideMenuDateFilterSubmit({
                ...$event,
                name: 'date-filter',
              })"
              @close="mainReestrComposable.sideMenuComponentSettings.value['date-filter'].isShown = false"
            />

            <NewReestrSideMenuSumms
              v-if="!!mainReestrComposable.sideMenuComponentSettings.value['summs']?.isShown"
              :data="mainReestrComposable.data.value as ILocalNewTableRow[]"
              :payload="mainReestrComposable.sideMenuComponentSettings.value['summs'].payload"
              @submit="mainReestrComposable.onNewReestrSideMenuSummsSubmit({
                ...$event,
                name: 'summs',
              })"
              @close="mainReestrComposable.sideMenuComponentSettings.value['summs'].isShown = false"
            />
          </template>
        </NewReestr>
      </template>

      <template #div2>
        <div class="page-reestr-tabs">
          <div class="page-reestr-tabs__buttons">
            <button
              :class="{
                '--active-tab': isActive(sub1ReestrComposable),
              }"
              @click="setActiveReestr(sub1ReestrComposable)"
            >Activate Sub1 Reestr</button>
            <button
              :class="{
                '--active-tab': isActive(sub2ReestrComposable),
              }"
              @click="setActiveReestr(sub2ReestrComposable)"
            >Activate Sub2 Reestr</button>
            <button
              :class="{
                '--active-tab': isActive(sub3ReestrComposable),
              }"
              @click="setActiveReestr(sub3ReestrComposable)"
            >Activate Sub3 Reestr</button>
          </div>
          <NewReestr
            ref="newSubReestrRef"
            :key="activeReestr.reestrName"
            class="test-page1__new-reestr page-reestr-tabs__reestr"
            :initial-data="activeReestr.data"
            :initial-columns="activeReestr.columns"
            :initialColumnSettings="activeReestr.columnSettings"
            :initial-filters="activeReestr.filters"
            :initial-sorts="activeReestr.sorts"
            :initial-actions-change-modes="activeReestr.actionsChangeModes"
            :initial-actions="activeReestr.actions"
            :initial-context-menu-items="activeReestr.contextMenuItems"
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
            :row-count="activeReestr.rowCount"
            :id-fields="activeReestr.idFields"
            @change:row-count="activeReestr.onChangeRowCount($event)"
            @row-action="activeReestr.onRowAction"
            @change:cell-value="activeReestr.onChangeCellValue"
            @select:context-menu-item="activeReestr.onSelectContextMenuItem"
            @change:filters="activeReestr.onChangeFilters($event)"
            @change:column-settings="activeReestr.onChangeColumnsettings($event)"
            @keyup="activeReestr.onRowAction"
          >
          </NewReestr>
        </div>
      </template>
    </NewSplitter>

    <NewReestrChangeRowParentDialog
      v-if="!!mainReestrComposable.activeRowForChangeParent.value"
      :activeSourceRow="mainReestrComposable.activeRowForChangeParent.value"
      @close="mainReestrComposable.activeRowForChangeParent.value = null"
      @change:destination-row-id="mainReestrComposable.onChangeRowParentId"
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

.test-page1 :deep(.split-div1) {
  padding-bottom: 4px;
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

.page-reestr-tabs {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.page-reestr-tabs__buttons {
  display: flex;
  gap: 8px;
  flex: 0 0;
  padding: 4px;
  box-sizing: border-box;
}

.page-reestr-tabs__buttons button {
  background-color: var(--app-button-bg);
  color: var(--app-button-text-color);
  border: 1px solid var(--app-button-border-color);
  border-radius: var(--app-button-radius);
  padding: 4px 8px;
  cursor: pointer;
}

.page-reestr-tabs__buttons button.--active-tab {
  background-color: var(--app-button-active-bg);
  color: var(--app-button-active-text-color);
  border: 1px solid var(--app-button-active-border-color);
}

.page-reestr-tabs__reestr {
  flex: 1 1;
  min-height: 0;
  box-sizing: border-box;
}
</style>