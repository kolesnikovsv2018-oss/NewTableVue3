<script setup lang="ts">
import type { StyleValue } from 'vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';

import type {
  INewTableRow,
  INewTableRowCommonMeta
} from '../NewTable/components/NewTableRow/types/NewTableRowTypes';
import type {
  INewTableColumn,
  INewTableColumnSetting,
  INewTableColumnSettings
} from '../NewTable/components/NewTableHeader/types/INewTableHeadTypes';
import type {
  INewTableChangeFilterValueEvent,
  INewTableChangeColumnsOrderEvent,
  INewTableChangeColumnWidthEvent,
  INewTableRowActionEvent,
  INewTableChangeCellValueEvent,
} from '../NewTable/types/NewTableEventTypes';
import type { INewTableFilters, INewTableSorts } from '../NewTable/types/NewTableFilterTypes';
import type { INewTableActions } from '../NewTable/types/NewTableActionTypes';
import type { TNewTableActionsChangeModesStandart } from '../NewTable/types/NewTableActionsChangeModesTypes';

import { useNewTableWrapperModes } from './composables/NewTableWrapperModes';
import { useNewTableWrapperFlatData } from './composables/NewTableWrapperFlatData';
import { useNewTablePagination } from './composables/NewTableWrapperPagination';
import { useWheelEvent } from '../../composables/useWheelEvent';
import { useNewTableWrapperColumns } from './composables/NewTableWrapperColumns';
import { useNewTableWrapperFilteredData } from './composables/NewTableWrapperFilteredData';
import { useNewTableWrapperSortData } from './composables/NewTableWrapperSortData';
import { useDebounceFn } from '@vueuse/core';
import { useNewTableSlots } from '../NewTable/composables/NewTableSlots';
import { useNewTableWrapperExpanded } from './composables/NewTableWrapperExpanded';
import { useNewTableWrapperChecked } from './composables/NewTableWrapperChecked';

import { NEW_TABLE_DEFAULT_ROW_TYPE } from '../NewTable/constants/defaultRowType';

import NewTable from '../NewTable/NewTable.vue';
import NewScroller from '../NewScroller/NewScroller.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  data: INewTableRow[];
  columns: INewTableColumn[];
  columnsSettings: Record<string, INewTableColumnSetting>;
  commonMeta?: INewTableRowCommonMeta;
  filters: INewTableFilters;
  sorts: INewTableSorts;
  actionsChangeModes: TNewTableActionsChangeModesStandart;
  // действия, доступные для каждой строки в зависимости от режима
  actions?: INewTableActions;
  isNumberColumnShown?: boolean;
  isCheckboxColumnShown?: boolean;
  isExpandColumnShown?: boolean;
  rowCount: number;
}>();

const emit = defineEmits<{
  (e: 'row-action', event: INewTableRowActionEvent): void;
  (e: 'change:cell-value', event: INewTableChangeCellValueEvent): void;

  (e: 'change:column-setting', event: INewTableColumnSettings): void;
  (e: 'change:filters', event: INewTableFilters): void;
  (e: 'change:sorts', event: INewTableSorts): void;

  (e: 'change:start-index', newStartIndex: number): void;
}>();

const {
  modeIds,
  editingIds,
  expandedIds,
  checkedIds,
  switchOnModeForRow,
  switchOffModeForRow,
  switchOnModeForRowWithChildren,
  switchOffModeForRowWithChildren,
  toggleModeForRow,
  toggleModeForRowWithChildren,
} = useNewTableWrapperModes();

const {
  filters,
  filteredData,
} = useNewTableWrapperFilteredData(
  () => props.data,
  () => props.filters,
);

const {
  sorts,
  sortedData,
} = useNewTableWrapperSortData(
  () => filteredData.value,
  () => props.sorts,
);

const {
  fullFlatData,
  filteredFlatData,
  onlyExpandedFlatData,
} = useNewTableWrapperFlatData(
  () => props.data,
  () => sortedData.value,
  () => modeIds.value
);

const {
  startIndex,
  onlyExpandedFlatDataToView,
  onPrevious,
  onNext
} = useNewTablePagination(
  () => filteredFlatData.value,
  () => onlyExpandedFlatData.value,
  () => props.rowCount,
);

const {
  localColumnsSettings,
  columnsSortByOrderVisible,
  changeColumnOrders,
  changeColumnWidths,
} = useNewTableWrapperColumns(
  () => props.columns,
  () => props.columnsSettings
);

const {
  isExpandedAll,
  toggleExpandAllRow,
} = useNewTableWrapperExpanded(
  () => modeIds.value,
  () => filteredFlatData.value,
);

const {
  isCheckedAll,
  toggleCheckAllRow,
} = useNewTableWrapperChecked(
  () => modeIds.value,
  () => filteredFlatData.value,
);

const { onWheelEvent } = useWheelEvent(onNext, onPrevious);

const onChangeFilterValueDebounced = useDebounceFn(
  (event: INewTableChangeFilterValueEvent) => onChangeFilterValue(event),
  300
);

const {
  computedCellSlots,
  computedHeadSlots,
} = useNewTableSlots();

const el = ref<InstanceType<typeof NewTable> | null>(null);

const changedRows = ref<Record<string, INewTableRow>>({});

onMounted(() => {
  if (!el.value?.$el) return;
  const element = el.value.$el as HTMLElement;
  element.addEventListener('wheel', onWheelEvent, { passive: true });
});

onBeforeUnmount(() => {
  if (!el.value?.$el) return;
  const element = el.value.$el as HTMLElement;
  element.removeEventListener('wheel', onWheelEvent);
});

/**
 * TODO вынести в хелпер или в композабл
 * и переиспользовать в TestPage при срабатывании выбора меню
 * @param event 
 */
function onAction(event: INewTableRowActionEvent) {
  const rowType = event.row.meta.rowType && event.row.meta.rowType in props.actionsChangeModes
    ? event.row.meta.rowType
    : NEW_TABLE_DEFAULT_ROW_TYPE;

  if (!!props.actionsChangeModes?.[rowType]?.[event.name]) {
    // если вызвано какое-то действие - action == event.name
    // то это действие может установить определенный режим для строки
    // и, при необходимости, для её дочерних строк
    props.actionsChangeModes[rowType][event.name].on?.forEach(
      (modeName: string) => props.actionsChangeModes[rowType][event.name].withChildren
        ? switchOnModeForRowWithChildren(modeName, event.row)
        : switchOnModeForRow(modeName, event.row),
    );
    props.actionsChangeModes[rowType][event.name].off?.forEach(
      (modeName: string) => props.actionsChangeModes[rowType][event.name].withChildren
        ? switchOffModeForRowWithChildren(modeName, event.row)
        : switchOffModeForRow(modeName, event.row),
    );
  }

  emit('row-action', event);
}

function onChangeColumnOrders(event: INewTableChangeColumnsOrderEvent) {
  if (
    !event.columnFrom
    || !event.columnTo
    || event.columnFrom === event.columnTo
  ) {
    return;
  }
  changeColumnOrders(event.columnFrom, event.columnTo);

  emit('change:column-setting', localColumnsSettings.value);
}

function onChangeColumnWidths(event: INewTableChangeColumnWidthEvent) {
  changeColumnWidths(event.columnName, event.delta, event.currentWidth);

  emit('change:column-setting', localColumnsSettings.value);
}

function onChangeFilterValue(event: INewTableChangeFilterValueEvent) {
  filters.value = {
    ...(filters.value || {}),
    [event.key]: {
      ...(filters.value[event.key] || {}),
      currentValue: event.value
    }
  }

  emit('change:filters', filters.value);
}

function onChangeColumnSort(event: INewTableSorts) {
  sorts.value = event;

  emit('change:sorts', event);
}

function onToggleExpandAllRow() {
  toggleExpandAllRow();
}

function onToggleCheckAllRow() {
  toggleCheckAllRow();
}

function onChangeCellValue(event: INewTableChangeCellValueEvent) {
  changedRows.value[event.row.data.id] = event.row;

  emit('change:cell-value', event);
}

function deleteChangedRow(idRow: number | string): INewTableRow {
  const {
    [idRow]: deletedRow,
    ...newChangedRows
  } = changedRows.value;
  changedRows.value = newChangedRows;

  return deletedRow;
}

function onChangeStartIndex(newStartIndex: number) {
  startIndex.value = newStartIndex;

  emit('change:start-index', newStartIndex);
}

defineExpose({
  modeIds,
  editingIds,
  expandedIds,
  checkedIds,
  switchOnModeForRow,
  switchOffModeForRow,
  switchOnModeForRowWithChildren,
  switchOffModeForRowWithChildren,
  toggleModeForRow,
  toggleModeForRowWithChildren,

  fullFlatData,
  filteredFlatData,

  changedRows,
  deleteChangedRow,
})
</script>

<template>
  <div
    :style="$attrs.style as Partial<StyleValue>"
    :class="$attrs.class"
  >
    <div class="new-table-wrapper">
      <NewTable
        ref="el"
        :data="onlyExpandedFlatDataToView"
        :changedRows="changedRows"
        :columns="columnsSortByOrderVisible"
        :columnsSettings="localColumnsSettings"
        :filters="filters"
        :sorts="sorts"
        :modeIds="modeIds"
        :startIndex="startIndex"
        :rowCount="rowCount"
        :commonMeta="props.commonMeta"
        :actions="actions"
        :isNumberColumnShown="isNumberColumnShown"
        :isCheckboxColumnShown="isCheckboxColumnShown"
        :isExpandColumnShown="isExpandColumnShown"
        :isExpandedAll="isExpandedAll"
        :isCheckedAll="isCheckedAll"
        v-bind="$attrs"
        @row-action="onAction"
        @change:columns-order="onChangeColumnOrders"
        @change:column-width="onChangeColumnWidths"
        @change:filter-value="onChangeFilterValueDebounced"
        @change:column-sort="onChangeColumnSort"
        @toggle:expand-all-row="onToggleExpandAllRow"
        @toggle:check-all-row="onToggleCheckAllRow"
        @change:cell-value="onChangeCellValue"
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
      </NewTable>

      <NewScroller
        :count="onlyExpandedFlatData.length"
        :position="startIndex"
        :rowCount="rowCount"
        class="new-table__scroller"
        @change:position="onChangeStartIndex"
      />
    </div>
  </div>
</template>

<style scoped>
@import '../NewTable/styles/variables.css';

.new-table-wrapper {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: stretch;
  justify-content: flex-start;
  gap: 1px;
  background-color: white;
  border-radius: var(--nt-border-radius);
  box-shadow: var(--nt-shadow);
}

.new-table__scroller {
  flex: 0 0 auto;
  border-radius: 0 var(--nt-border-radius) var(--nt-border-radius) 0;
  background-color: var(--nt-header-bg);
  transition: background-color var(--nt-transition-speed);
}

.new-table__scroller:hover {
  background-color: var(--nt-hover-bg);
}

@media (max-width: 768px) {
  .new-table-wrapper {
    gap: 0;
  }
}
</style>