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
@import './styles/variables.css';

.new-table {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--nt-border-color);
  border-radius: var(--nt-border-radius);
  height: 100%;
  width: 100%;
  background: var(--nt-bg);
  box-shadow: var(--nt-box-shadow);
  box-sizing: border-box;
  position: relative;
  color: var(--nt-text-color);
  overflow-y: hidden;
  overflow-x: auto;
}

/* Header Styles */
.new-table :deep(.new-table__header) {
  display: flex;
  flex-direction: column;
  background-color: var(--nt-header-bg);
  border-bottom: 1px solid var(--nt-border-color);
  color: var(--nt-text-color);
  position: sticky;
  top: 0;
  z-index: var(--nt-z-header);
  width: fit-content;
  min-width: 100%;
  font-weight: var(--nt-font-weight-bold);
  flex: 0 0;
}

.new-table :deep(.new-table__header__row) {
  display: flex;
  height: var(--nt-header-height);
  align-items: center;
  background-color: var(--nt-header-bg);
  box-sizing: border-box;
}

.new-table :deep(.new-table__header__cell) {
  padding: var(--nt-cell-padding);
  border-right: 1px solid var(--nt-border-color);
  position: relative;
  transition: all var(--nt-transition-speed);
  user-select: none;
  background-color: var(--nt-header-bg);
  color: var(--nt-text-color);
  box-sizing: border-box;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  display: flex;
  flex-wrap: nowrap;
}

.new-table :deep(.new-table__header__cell:hover) {
  background-color: var(--nt-hover-bg);
}

.new-table :deep(.new-table__header__cell .new-table__header__cell__filter__icon) {
  cursor: pointer;
  color: var(--nt-icon-color);
  transition: all var(--nt-transition-speed);
  font-size: var(--nt-icon-size);
  margin-left: 0.5rem;
}

.new-table :deep(.new-table__header__cell .new-table__header__cell__filter__icon:hover) {
  color: var(--nt-active-color);
  transform: scale(1.1);
}

.new-table :deep(.new-table__header__cell .new-table__header__cell__filter__icon.--active) {
  color: var(--nt-active-color);
  transform: scale(1.1);
}

.new-table :deep(.new-table__header__cell .new-table__header__cell__sort__icon) {
  cursor: pointer;
  color: var(--nt-icon-color);
  transition: all var(--nt-transition-speed);
  font-size: var(--nt-icon-size);
  margin-left: 0.5rem;
}

.new-table :deep(.new-table__header__cell .new-table__header__cell__sort__icon:hover) {
  color: var(--nt-active-color);
  transform: scale(1.1);
}

.new-table :deep(.new-table__header__cell__separator) {
  top: 0;
  width: 8px;
  right: -4px;
  height: 100%;
  cursor: col-resize;
  position: absolute;
  z-index: var(--nt-z-sticky);
  transition: background-color var(--nt-transition-speed);
}

.new-table :deep(.new-table__header__cell__separator:hover) {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Body Styles */
.new-table__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: fit-content;
  min-width: 100%;
  min-height: 0;
}

.new-table__body__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--nt-spacing-8);
  color: var(--nt-text-muted);
  font-size: var(--nt-font-size-lg);
}

.new-table__body :deep(.new-table__body__row) {
  display: flex;
  border-bottom: 1px solid var(--nt-border-color);
  color: var(--nt-text-color);
  align-items: center;
  transition: all var(--nt-transition-speed);
  background-color: var(--nt-bg);
  box-sizing: border-box;
}

.new-table__body :deep(.new-table__body__row:hover) {
  background-color: var(--nt-hover-bg);
}

.new-table__body :deep(.new-table__cell) {
  padding: var(--nt-cell-padding);
  border-right: 1px solid var(--nt-border-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--nt-text-color);
  background-color: inherit;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  box-sizing: border-box;
}

/* Fixed Columns */
.new-table :deep(.new-table__number-cell),
.new-table__body :deep(.new-table__number-cell) {
  padding: var(--nt-cell-padding);
  background-color: var(--nt-header-bg);
  border-right: 1px solid var(--nt-border-color);
  width: var(--nt-number-column-width);
  min-width: var(--nt-number-column-width);
  max-width: var(--nt-number-column-width);
  text-align: center;
  position: sticky;
  left: 0;
  z-index: var(--nt-z-sticky);
  color: var(--nt-text-color);
  font-weight: var(--nt-font-weight-medium);
}

.new-table :deep(.new-table__checkbox-cell),
.new-table__body :deep(.new-table__checkbox-cell) {
  padding: var(--nt-cell-padding);
  background-color: var(--nt-header-bg);
  border-right: 1px solid var(--nt-border-color);
  width: var(--nt-checkbox-column-width);
  min-width: var(--nt-checkbox-column-width);
  max-width: var(--nt-checkbox-column-width);
  text-align: center;
  position: sticky;
  left: var(--nt-number-column-width);
  z-index: var(--nt-z-sticky);
}

.new-table :deep(.new-table__expand-cell),
.new-table__body :deep(.new-table__expand-cell) {
  padding: var(--nt-cell-padding);
  background-color: var(--nt-header-bg);
  border-right: 1px solid var(--nt-border-color);
  width: var(--nt-expand-column-width);
  min-width: var(--nt-expand-column-width);
  max-width: var(--nt-expand-column-width);
  text-align: left;
  cursor: pointer;
  position: sticky;
  left: calc(var(--nt-number-column-width) + var(--nt-checkbox-column-width));
  z-index: var(--nt-z-sticky);
  color: var(--nt-text-color);
}

.new-table :deep(.new-table__actions__cell),
.new-table__body :deep(.new-table__actions__cell) {
  padding: var(--nt-cell-padding);
  background-color: var(--nt-header-bg);
  border-right: 1px solid var(--nt-border-color);
  width: var(--nt-actions-column-width);
  min-width: var(--nt-actions-column-width);
  max-width: var(--nt-actions-column-width);
  text-align: center;
  position: sticky;
  right: 0;
  z-index: var(--nt-z-actions);
  color: var(--nt-text-color);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .new-table {
    font-size: 0.875rem;
  }

  :root {
    --nt-header-height: 30px;
    --nt-number-column-width: 40px;
    --nt-checkbox-column-width: 40px;
    --nt-expand-column-width: 100px;
    --nt-actions-column-width: 80px;
  }
}

@media (max-width: 480px) {
  .new-table {
    font-size: 0.75rem;
  }

  :root {
    --nt-header-height: 24px;
    --nt-number-column-width: 30px;
    --nt-checkbox-column-width: 30px;
    --nt-expand-column-width: 80px;
    --nt-actions-column-width: 60px;
  }
}
</style>