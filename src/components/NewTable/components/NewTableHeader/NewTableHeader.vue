<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faFolder, faFolderOpen, faSortUp, faSortDown, faSort } from '@fortawesome/free-solid-svg-icons';

import type { INewTableColumn, INewTableHeaderSetting } from './types/INewTableHeadTypes';
import type {
  INewTableChangeFilterValue,
  INewTableChangeColumnsOrderEvent,
  INewTableChangeColumnWidthEvent
} from '../../types/NewTableEventTypes';
import type { INewTableFilters, INewTableSorts } from '../../types/NewTableFilterTypes';

import { generateColumnWidths } from '../../helpers/generateColumnWidths';
import { useNewTableHeaderMouseWidth } from './composables/NewTableHeaderMouseWidth';

import NewTableHeaderFilterTeleport from './components/NewTableHeaderFilterTeleport.vue';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const props = defineProps<{
  visibleSortedColumns: INewTableColumn[];
  localColumnsSettings: Record<string, INewTableHeaderSetting>;
  // фильтры для полей-колонок данных
  filters?: INewTableFilters,
  // объект сортировки, потенциально для нескольких полей
  sorts?: INewTableSorts,
  isNumberColumnShown?: boolean;
  isCheckboxColumnShown?: boolean;
  isExpandColumnShown?: boolean;
  isActionsColumnShown?: boolean;
  isExpandedAll: boolean;
  isCheckedAll: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle:expand-all-row'): void;
  (e: 'toggle:check-all-row', event?: boolean): void;
  (e: 'change:columns-order', event: INewTableChangeColumnsOrderEvent): void;
  (e: 'change:column-width', event: INewTableChangeColumnWidthEvent): void;
  (e: 'change:filter-value', event: INewTableChangeFilterValue): void;
  (e: 'change:column-sort', event: INewTableSorts): void;
}>();


const { onMouseDown } = useNewTableHeaderMouseWidth(() => props.localColumnsSettings, emit)

const activeHeaderFilterName = ref<string | null>(null)

const conputedColumnWidths = computed<Record<string, string>>(
  () => generateColumnWidths(props.visibleSortedColumns, props.localColumnsSettings),
);

// пока сортировка реализована только по одному полю - первому встретившимуся в localSorts
const computedSortFieldName = computed<string>(() => Object.keys(props.sorts || {})[0]);

const computedSortDirection = computed<-1 | 0 | 1>(
  () => computedSortFieldName.value ? props.sorts[computedSortFieldName.value] || 0 : 0
);

const computedIconName = computed<string>(
  () => {
    return computedSortDirection.value === 1
      ? faSortUp
      : computedSortDirection.value === -1
        ? faSortDown
        : faSort;
  }
);

const computedFilterTeleportNames = computed<Record<string, string>>(
  () => Object.keys(props.filters || {}).reduce(
    (acc: Record<string, string>, filterName: string) => {
      acc[filterName] = filterName ? `new-table-header-${filterName}-filter` : undefined;
      return acc;
    },
    {},
  )
)

const iconForExpandHead = computed<string>(
  () => props.isExpandedAll ? faFolderOpen : faFolder,
);

function getSortIconNameForField(fieldName: string) {
  if (fieldName === computedSortFieldName.value) {
    return computedIconName.value;
  }

  return faSort;
}

function onExpandHeadClick() {
  emit('toggle:expand-all-row');
}

function onDragStart(event: DragEvent, key: string) {
  const headerCell = (event.target as HTMLElement).closest('.new-table__header__cell');
  if (!headerCell || !event.dataTransfer) return;

  // event.dataTransfer.setData('text/plain', (headerCell as HTMLElement).innerText);
  // event.dataTransfer.setData('column-key', headerCell.getAttribute('data-column-key') || '');
  event.dataTransfer.setData('column-key', key);
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
}

function onDrop(event: DragEvent) {
  event.preventDefault();

  const targetCell = (event.target as HTMLElement).closest('.new-table__header__cell');
  if (!targetCell || !event.dataTransfer) return;

  const columnKey = event.dataTransfer.getData('column-key');
  const targetKey = targetCell.getAttribute('data-column-key') || '';

  if (columnKey === targetKey || !columnKey) return;

  emit('change:columns-order', {
    columnFrom: columnKey,
    columnTo: targetKey,
  });
}

function onChangeFilterValue({ key, value }: INewTableChangeFilterValue) {
  emit('change:filter-value', { key, value });
}

async function onClickOnFilter(key: string) {
  if (activeHeaderFilterName.value === key) {
    activeHeaderFilterName.value = null;
    return;
  }

  if (activeHeaderFilterName.value) {
    activeHeaderFilterName.value = null;
    await nextTick();
  }

  activeHeaderFilterName.value = key;
}

function onCloseFilterComponent(key: string) {
  if (activeHeaderFilterName.value === key) {
    activeHeaderFilterName.value = null;
    return;
  }
}

function onClickOnSort(key: string) {
  if (!props.sorts?.[key]) {
    emit('change:column-sort', { [key]: 1 });
    return;
  }

  emit('change:column-sort', { [key]: props.sorts[key] === 1 ? -1 : 0 });
}
</script>

<template>
  <div class="new-table__header">
    <div class="new-table__header__row">
      <div
        v-if="isNumberColumnShown"
        class="new-table__number-cell"
      />
      <div
        v-if="isCheckboxColumnShown"
        class="new-table__checkbox-cell"
      >
        <input
          :value="isCheckedAll"
          :checked="isCheckedAll"
          type="checkbox"
          @change="emit('toggle:check-all-row', (($event as InputEvent).target as HTMLInputElement).checked)"
        >
      </div>
      <div
        v-if="isExpandColumnShown"
        class="new-table__expand-cell"
        @click="onExpandHeadClick"
      >
        <FontAwesomeIcon
          :icon="iconForExpandHead"
          class="icon"
        />
      </div>
      <div
        v-for="(header, index) in visibleSortedColumns"
        :key="index"
        class="new-table__header__cell"
        :style="{
          width: conputedColumnWidths[header.key],
          'min-width': conputedColumnWidths[header.key],
          'max-width': conputedColumnWidths[header.key],
          position: 'relative',
        }"
        :data-column-key="header.key"
        :draggable="true"
        @dragstart="onDragStart($event, header.key)"
        @dragover="onDragOver"
        @drop="onDrop"
      >
        <slot
          :name="`head[${header.key}]`"
          v-bind="{
            cellName: header.key,
            header,
            columnSettings: localColumnsSettings,
            filters: props.filters,
            sorts: props.sorts,
          }"
        >
          {{ header.name }}
        </slot>

        <slot
          :name="`head[${header.key}]filter`"
          v-bind="{
            cellName: header.key,
            header,
            columnSettings: localColumnsSettings,
            filters: props.filters,
            sorts: props.sorts,
          }"
        >
          <FontAwesomeIcon
            v-if="Object.keys(props.filters || {}).includes(header.key)"
            :icon="faFilter"
            class="icon new-table__header__cell__filter__icon"
            :class="{
              '--active': props.filters[header.key]?.currentValue !== undefined
                && props.filters[header.key]?.currentValue !== null
                && (
                  'isDefault' in props.filters[header.key]
                    ? props.filters[header.key].isDefault(
                      props.filters[header.key].currentValue, props.filters[header.key].defaultValue
                    ) === false
                    : props.filters[header.key].currentValue !== props.filters[header.key]?.defaultValue
                ),
            }"
            @click.stop.prevent="onClickOnFilter(header.key)"
          />
        </slot>

        <slot
          :name="`head[${header.key}]sort`"
          v-bind="{
            cellName: header.key,
            header,
            columnSettings: localColumnsSettings,
            filters: props.filters,
            sorts: props.sorts,
          }"
        >
          <FontAwesomeIcon
            :icon="getSortIconNameForField(header.key)"
            class="icon new-table__header__cell__sort__icon"
            @click="onClickOnSort(header.key)"
          />
        </slot>

        <!-- Teleport target -->
        <div
          v-if="!!activeHeaderFilterName && !!computedFilterTeleportNames[header.key]"
          :id="computedFilterTeleportNames[header.key]"
          :style="{
            position: 'absolute',
            zIndex: 3,
          }"
        />

        <span
          class="new-table__header__cell__separator"
          @mousedown.stop.prevent="onMouseDown(header.key, $event)"
          @click.stop.prevent=""
        />
      </div>
      <div
        v-if="isActionsColumnShown"
        class="new-table__actions__cell"
      />
    </div>

    <NewTableHeaderFilterTeleport
      v-if="activeHeaderFilterName"
      :activeHeaderFilterName="activeHeaderFilterName"
      :computedFilterTeleportNames="computedFilterTeleportNames"
      :filters="filters"
      @change:filter-value="onChangeFilterValue"
      @close="onCloseFilterComponent"
    />
  </div>
</template>
