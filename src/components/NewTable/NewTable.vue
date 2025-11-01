<script setup lang="ts">
import { computed } from 'vue';

import type { INewTableRow, INewTableRowCommonMeta } from './components/NewTableRow/types/NewTableRowTypes';
import type { INewTableColumn, INewTableHeaderSetting } from './components/NewTableHeader/types/INewTableHeadTypes';
import type {
  INewTableChangeFilterValue,
  INewTableChangeColumnsOrderEvent,
  INewTableChangeColumnWidthEvent,
  INewTableRowActionEvent,
  INewTableChangeCellValueEvent,
} from './types/NewTableEventTypes';
import type { INewTableFilters, INewTableSorts } from './types/NewTableFilterTypes';
import type { INewTableActions } from './types/NewTableActionTypes';

import { NEW_TABLE_STANDART_ROW_MODES } from './constants/standartRowModes';

import NewTableHeader from './components/NewTableHeader/NewTableHeader.vue';
import NewTableRow from './components/NewTableRow/NewTableRow.vue';
import { useNewTableSlots } from './composables/NewTableSlots';

const props = defineProps<{
  // подготовленные данные, которые полностьб будут отображаться
  data: INewTableRow[];
  // измененные строки, которые редактируются в данный момент
  // эти данные нужны, чтобы не терялись изменения при скроле,
  // когда компоненты строки полностьб демонтирубтся и локальное состояние теряется
  changedRows?: Record<string, INewTableRow>;
  // подгттовленные колокни - отсортированные и отображаемые
  columns: INewTableColumn[];
  // фильтры для полей-колонок данных
  filters?: INewTableFilters,
  // объект сортировки, потенциально для нескольких полей
  sorts?: INewTableSorts,
  // настройки колонок, тут важна установленная ширина
  columnsSettings: Record<string, INewTableHeaderSetting>;
  // габоры ID-шников в разлиных режимах отображения
  modeIds: Record<string, Set<number | string>>;
  // с какого номера в полном массиве данных начинается текущий набор данных
  startIndex: number;
  // кол-во отображаемых строк
  rowCount: number;
  // общие метаданные для строки данных, будут применяться, если такие не указаны для конкретной строки
  commonMeta?: INewTableRowCommonMeta
  // действия, доступные для каждой строки в зависимости от режима
  actions?: INewTableActions;
  isNumberColumnShown?: boolean;
  isCheckboxColumnShown?: boolean;
  isExpandColumnShown?: boolean;
  isExpandedAll: boolean;
  isCheckedAll: boolean;
}>();

const emit = defineEmits<{
  // (e: 'toggle:expand-row', row: INewTableRow): void;
  (e: 'row-action', event: INewTableRowActionEvent): void;
  // (e: 'change:cell-data', event: INewTableUpdateCellDataEvent): void;
  (e: 'change:columns-order', event: INewTableChangeColumnsOrderEvent): void;
  (e: 'change:column-width', event: INewTableChangeColumnWidthEvent): void;
  (e: 'change:filter-value', event: INewTableChangeFilterValue): void;
  (e: 'change:column-sort', event: INewTableSorts): void;
  (e: 'toggle:expand-all-row'): void;
  (e: 'toggle:check-all-row'): void;
  (e: 'change:cell-value', event: INewTableChangeCellValueEvent): void;
}>();

defineOptions({
  inheritAttrs: false,
});

const {
  computedHeadSlots,
  computedCellSlots
} = useNewTableSlots();

const computedModeIds = computed(() => props.modeIds);

// const rowCount = computed<number>(() => props.data?.length || 1);
const rowCount = computed<number>(() => props.rowCount || 5);

const computedRowStyle = computed(
  () => ({
    height: `${100 / rowCount.value}% !important`,
    'max-height': `${100 / rowCount.value}% !important`,
    'min-height': `${100 / rowCount.value}% !important`,
    flex: `0 0 ${100 / rowCount.value}% !important`,
  })
);

// если передать действия, то будет отображаться колонка с доступными для строки действиями
const isActionsColumnShown = computed<boolean>(
  () => !!Object.keys(props.actions || {}).length,
);

function getModesForRow(row: INewTableRow): string[] | undefined {
  const result = Object.keys(computedModeIds.value || {}).filter(
    (mode) => computedModeIds.value?.[mode]?.has(row.data.id)
  );

  if (!result.includes(NEW_TABLE_STANDART_ROW_MODES.EDIT) && !result.includes(NEW_TABLE_STANDART_ROW_MODES.VIEW)) {
    result.push(NEW_TABLE_STANDART_ROW_MODES.VIEW);
  }

  return result;
}
</script>

<template>
  <div class="new-table">
    <NewTableHeader
      :visibleSortedColumns="columns"
      :localColumnsSettings="columnsSettings"
      :filters="filters"
      :sorts="sorts"
      :isNumberColumnShown="isNumberColumnShown"
      :isCheckboxColumnShown="isCheckboxColumnShown"
      :isExpandColumnShown="isExpandColumnShown"
      :isActionsColumnShown="isActionsColumnShown"
      :isExpandedAll="isExpandedAll"
      :isCheckedAll="isCheckedAll"
      @change:columns-order="$emit('change:columns-order', $event)"
      @change:column-width="$emit('change:column-width', $event)"
      @change:filter-value="emit('change:filter-value', $event)"
      @change:column-sort="emit('change:column-sort', $event)"
      @toggle:expand-all-row="emit('toggle:expand-all-row')"
      @toggle:check-all-row="emit('toggle:check-all-row')"
    >
      <template
        v-for="slot in computedHeadSlots"
        :key="slot"
        #[slot]="slotProps"
      >
        <slot
          :name="slot"
          v-bind="slotProps"
        ></slot>
      </template>
    </NewTableHeader>

    <div
      v-if="!!data?.length"
      class="new-table__body"
    >
      <!-- 
        @toggle:expand-row="$emit('toggle:expand-row', $event)"
        @change:cell-data="$emit('change:cell-data', $event)"
      -->
      <NewTableRow
        v-for="(row, rowIndex) in data"
        :key="`${startIndex + rowIndex + 1}-${row.data.id}`"
        :row="row"
        :changedRow="changedRows[row.data.id]"
        :localColumnsSettings="columnsSettings"
        :isNumberColumnShown="true"
        :rowNumber="startIndex + rowIndex + 1"
        :actions="actions"
        :isCheckboxColumnShown="isCheckboxColumnShown"
        :isExpandColumnShown="isExpandColumnShown"
        :isActionsColumnShown="isActionsColumnShown"
        :visibleSortedColumns="columns"
        :modes="getModesForRow(row)"
        :commonMeta="props.commonMeta"
        :style="computedRowStyle"
        v-bind="$attrs"
        @row-action="$emit('row-action', $event)"
        @change:cell-value="$emit('change:cell-value', $event)"
      >
        <template
          v-for="slot in computedCellSlots"
          :key="slot"
          #[slot]="slotProps"
        >
          <slot
            :name="slot"
            v-bind="slotProps"
          ></slot>
        </template>
      </NewTableRow>
    </div>

    <div
      v-else
      class="new-table__body"
    >
      <slot name="empty">
        <div class="new-table__body__empty">No data!</div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.new-table {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  /* border-radius: 4px; */
  border-top-left-radius: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 4px;
  overflow: hidden;
  height: 100%;
  width: 100%;
  overflow-x: scroll;
  box-sizing: border-box;
}

.new-table :deep(.new-table__header) {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  color: #333;
  flex: 0 0;
  width: fit-content;
  min-width: 100%;
  box-sizing: border-box;
}

.new-table :deep(.new-table__header__row) {
  display: flex;
  box-sizing: border-box;
}

.new-table :deep(.new-table__header__cell) {
  padding: 8px;
  font-weight: bold;
  border-right: 1px solid #ccc;
  box-sizing: border-box;
  position: relative;
}

.new-table :deep(.new-table__header__cell .new-table__header__cell__filter__icon) {
  cursor: pointer;
}

.new-table :deep(.new-table__header__cell .new-table__header__cell__filter__icon.--active) {
  color: blue;
}

.new-table :deep(.new-table__header__cell .new-table__header__cell__sort__icon) {
  cursor: pointer;
}

.new-table :deep(.new-table__header__cell__separator) {
  top: 0;
  width: 5px;
  right: -3px;
  height: 100%;
  cursor: col-resize;
  position: absolute;
  /* background-color: rgba(0, 0, 0, 0.1); */
  /* border-left: 2px solid rgba(255, 255, 255, 0.0); */
  /* border-right: 2px solid rgba(255, 255, 255, 0.0); */
  z-index: 2;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.new-table__body {
  display: flex;
  flex-direction: column;
  flex: 1 1;
  min-height: 0;
  width: fit-content;
  min-width: 100%;
  box-sizing: border-box;
}

.new-table__body__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  box-sizing: border-box;
}

.new-table__body :deep(.new-table__body__row) {
  display: flex;
  border-bottom: 1px solid #eee;
  color: #555;
  box-sizing: border-box;
}

.new-table__body :deep(.new-table__cell) {
  padding: 4px;
  border-right: 1px solid #eee;
  box-sizing: border-box;
  overflow: hidden;
}

.new-table :deep(.new-table__number-cell),
.new-table__body :deep(.new-table__number-cell) {
  padding: 8px;
  background-color: #f5f5f5;
  border-right: 1px solid #ccc;
  box-sizing: border-box;
  width: 50px;
  min-width: 50px;
  max-width: 50px;
  text-align: center;
  position: sticky;
  left: 0;
  overflow: hidden;
  z-index: 3;
}

.new-table :deep(.new-table__checkbox-cell),
.new-table__body :deep(.new-table__checkbox-cell) {
  padding: 8px;
  border-right: 1px solid #eee;
  box-sizing: border-box;
  width: 50px;
  min-width: 50px;
  max-width: 50px;
  text-align: center;
  position: sticky;
  left: 50px;
  background-color: aliceblue;
  z-index: 3;
}

.new-table :deep(.new-table__expand-cell),
.new-table__body :deep(.new-table__expand-cell) {
  padding: 8px;
  border-right: 1px solid #eee;
  box-sizing: border-box;
  width: 120px;
  min-width: 120px;
  max-width: 120px;
  text-align: left;
  cursor: pointer;
  position: sticky;
  left: 100px;
  background-color: aliceblue;
  z-index: 3;
}

.new-table :deep(.new-table__actions__cell),
.new-table__body :deep(.new-table__actions__cell) {
  padding: 8px;
  box-sizing: border-box;
  width: 100px;
  min-width: 100px;
  max-width: 100px;
  text-align: center;
  position: sticky;
  right: 0;
  background-color: aliceblue;
  z-index: 3;
}
</style>