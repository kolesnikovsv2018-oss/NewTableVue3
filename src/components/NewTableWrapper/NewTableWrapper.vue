<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import type { INewTableRow, INewTableRowCommonMeta } from '../NewTable/components/NewTableRow/types/NewTableRowTypes';
import type { INewTableColumn, INewTableHeaderSetting } from '../NewTable/components/NewTableHeader/types/INewTableHeadTypes';
import type {
  INewTableChangeFilterValue,
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
import { useNewTableWrapperHeader } from './composables/NewTableWrapperHeader';
import { useNewTableWrapperFilteredData } from './composables/NewTableWrapperFilteredData';
import { useNewTableWrapperSortData } from './composables/NewTableWrapperSortData';
import { useDebounceFn } from '@vueuse/core';
import { useNewTableSlots } from '../NewTable/composables/NewTableSlots';
import { useNewTableWrapperExpanded } from './composables/NewTableWrapperExpanded';
import { useNewTableWrapperChecked } from './composables/NewTableWrapperChecked';

import { NEW_TABLE_DEFAULT_ROW_TYPE } from '../NewTable/constants/defaultRowType';

import NewTable from '../NewTable/NewTable.vue';
import NewScroller from '../NewScroller/NewScroller.vue';

const props = defineProps<{
  data: INewTableRow[];
  columns: INewTableColumn[];
  columnsSettings: Record<string, INewTableHeaderSetting>;
  commonMeta?: INewTableRowCommonMeta;
  filters: INewTableFilters;
  sorts: INewTableSorts;
  actionsChangeModes: TNewTableActionsChangeModesStandart;
  // действия, доступные для каждой строки в зависимости от режима
  actions?: INewTableActions;
  isNumberColumnShown?: boolean;
  isCheckboxColumnShown?: boolean;
  isExpandColumnShown?: boolean;
}>();

const emit = defineEmits<{
  (e: 'row-action', event: INewTableRowActionEvent): void;
  (e: 'change:column-width', event: INewTableChangeColumnWidthEvent): void;
  (e: 'change:position', newPosition: number): void;
  (e: 'change:cell-value', event: INewTableChangeCellValueEvent): void;
  (e: 'change:filters', event: INewTableFilters): void;
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
  rowCount,
  onlyExpandedFlatDataToView,
  setRowCount,
  onPrevious,
  onNext
} = useNewTablePagination(
  () => filteredFlatData.value,
  () => onlyExpandedFlatData.value,
);

const {
  localColumnsSettings,
  columnsSortByOrderVisible,
  changeColumnOrders,
  changeColumnWidths,
} = useNewTableWrapperHeader(
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
  (event: INewTableChangeFilterValue) => onChangeFilterValue(event),
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
}

function onChangeColumnWidths(event: INewTableChangeColumnWidthEvent) {
  changeColumnWidths(event.columnName, event.delta, event.currentWidth);
}

function onChangeFilterValue(event: INewTableChangeFilterValue) {
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

function onChangePosition(newPosition: number) {
  startIndex.value = newPosition;
  emit('change:position', newPosition);
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

  rowCount,
  setRowCount,
  fullFlatData,
  filteredFlatData,

  changedRows,
  deleteChangedRow,
})
</script>

<template>
  <div>
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
        @change:position="onChangePosition"
      />
    </div>
  </div>
</template>

<style scoped>
.new-table-wrapper {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: stretch;
  justify-content: flex-start;
}

.new-table__scroller {
  flex: 0 0;
  border-top-left-radius: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 0;
  background-color: var(--nt-scrollbar-background, #f5f5f5);
}
</style>