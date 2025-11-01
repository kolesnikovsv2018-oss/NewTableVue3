<script setup lang="ts">
import { computed, StyleValue, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faFolder, faFolderOpen, faFile } from '@fortawesome/free-solid-svg-icons';

import type {
  INewTableRow,
  INewTableRowCommonMeta
} from './types/NewTableRowTypes';
import type { INewTableColumn, INewTableHeaderSetting } from '../NewTableHeader/types/INewTableHeadTypes';
import type {
  INewTableCellActionData,
  INewTableCellNativeEvent,
  INewTableRowActionEvent,
  INewTableChangeCellValueEvent,
} from '../../types/NewTableEventTypes';
import type { INewTableActions, INewTableRowAction, INewTableRowActions } from '../../types/NewTableActionTypes';

import { generateColumnWidths } from '../../helpers/generateColumnWidths';
import { NEW_TABLE_STANDART_ROW_MODES } from '../../constants/standartRowModes';
import { NEW_TABLE_DEFAULT_CELL_COMPONENT_NAME } from '../../constants/defaultComponentName';
import {
  NEW_TABLE_STANDART_ROW_ACTIONS
} from '../../../NewTableWrapper/constants/standartActions';
import { NEW_TABLE_DEFAULT_ROW_TYPE } from '../../constants/defaultRowType';

const props = defineProps<{
  row: INewTableRow;
  changedRow?: INewTableRow;
  localColumnsSettings: Record<string, INewTableHeaderSetting>;
  visibleSortedColumns: INewTableColumn[];
  isNumberColumnShown?: boolean;
  isCheckboxColumnShown?: boolean;
  isExpandColumnShown?: boolean;
  isActionsColumnShown?: boolean;
  rowNumber?: number;
  modes?: string[];
  commonMeta?: INewTableRowCommonMeta;
  actions?: INewTableActions;
}>();

const emit = defineEmits<{
  // (e: 'toggle:expand-row', row: INewTableRow): void;
  (e: 'row-action', event: INewTableRowActionEvent): void;
  // (e: 'change:cell-data', event: INewTableUpdateCellDataEvent): void;
  // (e: 'cell-action', event: INewTableCellActionEvent): void;
  (e: 'dblclick', event: INewTableCellNativeEvent): void;
  (e: 'contextmenu', event: INewTableCellNativeEvent): void;
  (e: 'change:cell-value', event: INewTableChangeCellValueEvent): void;
}>();

// эта опция отключит передачу таких атрибутов как style и class
// нужно подумать насколько необходима эта опция
// стили сейчас применяются через
// :style="$attrs.style as Partial<StyleValue>"
defineOptions({
  inheritAttrs: false,
});

const isChecked = computed<boolean>(
  () => props.modes?.includes(NEW_TABLE_STANDART_ROW_MODES.CHECKED) || false,
);

const isExpanded = computed<boolean>(
  () => props.modes?.includes(NEW_TABLE_STANDART_ROW_MODES.EXPANDED) || false,
);

const iconForExpandCell = computed<string>(() => {
  if (!props.row?.children?.length) {
    return faFile;
  }
  return isExpanded.value ? faFolderOpen : faFolder;
});

const conputedColumnWidths = computed<Record<string, string>>(
  () => generateColumnWidths(props.visibleSortedColumns, props.localColumnsSettings),
);

// const actions = computed(() => props.row?.actions || {});

const computedCssClasses = computed<string>(
  () => {
    if (props.row.meta.class) {
      return props.row.meta.class;
    }
    if (props.row.meta?.rowType) {
      return props.commonMeta?.class?.[props.row.meta.rowType] || '';
    }

    return '';
  }
);

const enabledActions = computed<INewTableRowActions>(
  () => {
    if (!props.actions) {
      return {};
    }

    const rowType = props.row.meta.rowType || NEW_TABLE_DEFAULT_ROW_TYPE;
    const rowActions = props.actions[rowType] || props.actions[NEW_TABLE_DEFAULT_ROW_TYPE];

    if (!rowActions) {
      return {};
    }

    return Object.keys(rowActions).filter(
      (actionName: string) => checkIsActionEnabled(rowActions[actionName], props.modes),
    ).reduce(
      (acc: INewTableRowActions, enabledActionName: string): INewTableRowActions => {
        acc[enabledActionName] = rowActions[enabledActionName];
        return acc;
      },
      {}
    )
  },
);

const computedActiveRow = computed<INewTableRow>(
  () => props.modes?.includes(NEW_TABLE_STANDART_ROW_MODES.EDIT)
    ? props.changedRow || props.row
    : props.row,
);

let localRow: INewTableRow = !!(props.changedRow || props.row) ? JSON.parse(JSON.stringify(props.changedRow || props.row)) : null;

watch(
  () => props.row,
  (newRow) => {
    localRow = !!(props.changedRow || newRow) ? JSON.parse(JSON.stringify(props.changedRow || newRow)) : null;
  },
);

watch(
  () => props.changedRow,
  (newRow) => {
    localRow = !!(newRow || props.row) ? JSON.parse(JSON.stringify(newRow || props.row)) : null;
  },
);

function onExpandCellClick() {
  if (!props.row?.children?.length) {
    return;
  }

  if (isExpanded.value) {
    emit('row-action', { name: NEW_TABLE_STANDART_ROW_ACTIONS.EXPAND_OFF, row: props.row });
  } else {
    emit('row-action', { name: NEW_TABLE_STANDART_ROW_ACTIONS.EXPAND_ON, row: props.row });
  }
}

function getComponentName(header: INewTableColumn, rowType?: string | number) {
  if (!header?.components) {
    return NEW_TABLE_DEFAULT_CELL_COMPONENT_NAME;
  }

  if (!rowType) {
    return header.components[NEW_TABLE_DEFAULT_ROW_TYPE]?.name || NEW_TABLE_DEFAULT_CELL_COMPONENT_NAME;
  }

  return header.components[rowType]?.name
    || header.components[NEW_TABLE_DEFAULT_ROW_TYPE]?.name
    || NEW_TABLE_DEFAULT_CELL_COMPONENT_NAME;
}

function checkIsActionEnabled(action: INewTableRowAction, modes: string[]) {
  // если для действия не задан ни один режим, это подразумевает,
  // что действие доступно для любого режима
  if (!action?.modes?.length) {
    return true;
  }

  // если не переданы режимы для строки, т.е. они не настроены,
  // то так же отображаем все действия
  if (!modes) {
    return true;
  }

  // если режимы переданы как пустой массив,
  // то значит сейчас для строки все рижимы отклочены,
  // и доступны будут только действия, для которых режимы не указаны (из первого условия)
  if (!modes.length) {
    return false;
  }

  // проверяем, что хотябы один режим для строки присутвует у действия
  return action.modes.some((mode: string) => !!modes.includes(mode));
}

function getComponentProps(header: INewTableColumn, rowType?: string | number) {
  if (!header?.components) {
    return {};
  }

  if (!rowType) {
    return header.components[NEW_TABLE_DEFAULT_ROW_TYPE]?.props || {};
  }

  return header.components[rowType]?.props || {};
}

function onChangeCheck($event: InputEvent) {
  const value = ($event.target as HTMLInputElement)?.checked;

  let actionName = NEW_TABLE_STANDART_ROW_ACTIONS.CHECK_OFF; // 'check-off';

  if (value) {
    actionName = NEW_TABLE_STANDART_ROW_ACTIONS.CHECK_ON; // 'check-on';
  }

  emit('row-action', {
    name: actionName,
    row: localRow,
    value: value,
  })
}

function onChangeCellValue({ key, value }: { key: string, value: unknown }) {
  // при изменениях значений ячеек отрабатывает специфическое поведение
  // родителю никакие события не отправляются
  // меняются локальные данны
  // эти данные отправляются родителю только при срабатывании action (действия нажатии иконки)
  localRow.data[key] = value;
  // onCellAction({ key, value, name: NEW_TABLE_STANDART_CELL_ACTIONS.CHANGE_CELL });
  emit('change:cell-value', { key, value, row: localRow });
}

function onCellAction({ key, value, name }: INewTableCellActionData) {
  emit('row-action', {
    name: NEW_TABLE_STANDART_ROW_ACTIONS.CELL_ACTION,
    row: localRow,
    value: {
      name,
      key,
      value,
    },
  });
}
</script>

<template>
  <div
    class="new-table__body__row"
    :class="computedCssClasses"
    :style="$attrs.style as Partial<StyleValue>"
  >
    <div
      v-if="isNumberColumnShown"
      class="new-table__number-cell"
    >
      <slot
        name="cell[number]"
        v-bind="{
          row,
          headers: visibleSortedColumns,
          columnSettings: localColumnsSettings,
          rowNumber,
          modes,
        }"
      >
        {{ rowNumber }}
      </slot>
    </div>

    <div
      v-if="isCheckboxColumnShown"
      class="new-table__checkbox-cell"
    >
      <slot
        name="cell[checkbox]"
        v-bind="{
          row,
          headers: visibleSortedColumns,
          columnSettings: localColumnsSettings,
          rowNumber,
          modes,
        }"
      >
        <input
          :value="isChecked"
          :checked="isChecked"
          type="checkbox"
          @change="onChangeCheck"
        >
      </slot>
    </div>

    <div
      v-if="isExpandColumnShown"
      class="new-table__expand-cell"
      @click="onExpandCellClick"
    >
      <slot
        name="cell[expand]"
        v-bind="{
          row,
          headers: visibleSortedColumns,
          columnSettings: localColumnsSettings,
          rowNumber,
          modes,
        }"
      >
        <div :style="{
          paddingLeft: row.__level ? `${row.__level * 16}px` : '',
        }">
          <FontAwesomeIcon
            :icon="iconForExpandCell"
            class="icon"
          />
        </div>
      </slot>
    </div>

    <div
      v-for="(header, cellIndex) in visibleSortedColumns"
      :key="cellIndex"
      class="new-table__cell"
      :style="{
        width: conputedColumnWidths[header.key],
        'min-width': conputedColumnWidths[header.key],
        'max-width': conputedColumnWidths[header.key],
      }"
      @dblclick.stop.prevent="$emit('dblclick', { row: localRow, header, event: $event })"
      @contextmenu.stop.prevent="$emit('contextmenu', { row: localRow, header, event: $event, modes: props.modes })"
    >
      <slot
        :name="`cell[${header.key}]`"
        v-bind="{
          cellName: header.key,
          value: row.data[header.key],
          row,
          header,
          columnSettings: localColumnsSettings,
        }"
      >
        <component
          :is="getComponentName(header, computedActiveRow.meta.rowType || props.commonMeta?.rowType)"
          v-if="header?.components"
          :value="computedActiveRow.data[header.key]"
          :row="computedActiveRow"
          :column="header"
          :mode="(props.modes?.includes(NEW_TABLE_STANDART_ROW_MODES.EDIT)
            ? NEW_TABLE_STANDART_ROW_MODES.EDIT
            : NEW_TABLE_STANDART_ROW_MODES.VIEW
          ) || NEW_TABLE_STANDART_ROW_MODES.VIEW"
          v-bind="getComponentProps(header, computedActiveRow.meta.rowType || props.commonMeta?.rowType)"
          @update:value="onChangeCellValue({ key: header.key, value: $event })"
          @input="onChangeCellValue({ key: header.key, value: $event })"
          @change="onChangeCellValue({ key: header.key, value: $event })"
          @cell-action="onCellAction({ key: header.key, value: $event.value, name: $event.name })"
        >{{ computedActiveRow.data[header.key] }}</component>
        <span v-else>{{ computedActiveRow.data[header.key] }}</span>
      </slot>
    </div>

    <div
      v-if="isActionsColumnShown"
      class="new-table__actions__cell"
    >
      <div style="display: flex; gap: 4px;">
        <div
          v-for="(action, actionKey) in enabledActions"
          :key="actionKey"
        >
          <FontAwesomeIcon
            :icon="action.icon || 'fa-solid fa-circle-info'"
            class="icon new-table__action-icon"
            :title="action.label || action.actionName"
            @click="$emit('row-action', { name: action.actionName, row: computedActiveRow })"
          />
          <span v-if="!!action.label">{{ action.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
