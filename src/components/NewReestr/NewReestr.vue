<script setup lang="ts">
import type { StyleValue } from 'vue';
import { ref, watch } from 'vue';

import type { INewTableRow, INewTableRowCommonMeta } from '../NewTable/components/NewTableRow/types/NewTableRowTypes';
import type { INewTableColumns, INewTableColumnSettings } from '../NewTable/components/NewTableHeader/types/INewTableHeadTypes';
import type { INewTableRowActionEvent, INewTableChangeCellValueEvent } from '../NewTable/types/NewTableEventTypes';
import type { IChangeColumnSettingEvent } from './components/NewReestrColumnSettings/types';
import type { TNewTableActionsChangeModesStandart } from '../NewTable/types/NewTableActionsChangeModesTypes';
import type { INewMenuItem } from '../NewContextMenu/types';
import type { INewTableActions } from '../NewTable/types/NewTableActionTypes';
import type { INewReestrContexMenuItems, INewReestrSettingsActionEvent } from './types/newReestrTypes';
import type { INewTableFilters, INewTableSorts } from '../NewTable/types/NewTableFilterTypes';

import { useNewReestrContextMenu } from './composables/NewReestrContextMenu';
import { useNewTableSlots } from '../NewTable/composables/NewTableSlots';

import { NEW_TABLE_DEFAULT_ROW_TYPE } from '../NewTable/constants/defaults';
import { NEW_TABLE_STANDART_ROW_MODES } from '../NewTable/constants/standartRowModes';

import NewTableWrapper from '../NewTableWrapper/NewTableWrapper.vue';
import NewContextMenu from '../NewContextMenu/NewContextMenu.vue';
// import NewReestrColumnSettings from './components/NewReestrColumnSettings/NewReestrColumnSettings.vue';
import NewReestrSettings from './components/NewReestrSettings/NewReestrSettings.vue';
import NewReestrColumnSettingsModal from './components/NewReestrColumnSettings/NewReestrColumnSettingsModal.vue';
import NewReestrSideMenu from './components/NewReestrSideMenu/NewReestrSideMenu.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  initialData: INewTableRow[];
  initialColumns: INewTableColumns;
  initialColumnSettings: INewTableColumnSettings;
  initialFilters: INewTableFilters;
  initialSorts: INewTableSorts;
  initialActions: INewTableActions;
  initialActionsChangeModes: TNewTableActionsChangeModesStandart;
  initialContextMenuItems: INewReestrContexMenuItems;
  sideMenuItems?: INewMenuItem[];
  isNumberColumnShown?: boolean;
  isCheckboxColumnShown?: boolean;
  isExpandColumnShown?: boolean;
  commonMeta?: INewTableRowCommonMeta;
  rowCount?: number;
}>();

const emit = defineEmits<{
  (e: 'row-action', event: INewTableRowActionEvent): void;
  (e: 'change:cell-value', event: INewTableChangeCellValueEvent): void;

  (e: 'change:column-settings', event: INewTableColumnSettings): void;
  (e: 'change:filters', event: INewTableFilters): void;
  (e: 'change:sorts', event: INewTableSorts): void;

  (e: 'select:context-menu-item', menuItem: INewMenuItem): void;
  (e: 'select:side-menu-item', menuItem: INewMenuItem): void;

  (e: 'settings-action', event: INewReestrSettingsActionEvent): void;
  (e: 'change:row-count', rowCount: number): void;
  (e: 'change:start-index', startInde: number): void;
}>();

const {
  generateContextMenuItemsWithPayload,
} = useNewReestrContextMenu();

const {
  computedCellSlots,
  computedHeadSlots,
} = useNewTableSlots();

const newTableWrapperRef = ref<typeof NewTableWrapper>();

const columnSettings = ref<INewTableColumnSettings>(
  JSON.parse(JSON.stringify(props.initialColumnSettings))
);

const activeContextMenuItems = ref<INewMenuItem[]>([])

const activeContextMenuMouseEvent = ref<MouseEvent>(null)

// const rowCount = ref<number>(10);

const isColumnSettingsShown = ref<boolean>(false);

watch(
  () => props.initialColumnSettings,
  () => { columnSettings.value = JSON.parse(JSON.stringify(props.initialColumnSettings)); }
)

/**
 * Обновляет настройки для одной колонки
 * @param {IChangeColumnSettingEvent} event содержит имя колонки, настройки которой поменялись,
 * и настройки для всех колонок
 */
function onChangeColumnSetting(event: IChangeColumnSettingEvent) {
  columnSettings.value = event.columnSettings;
  // columnSettings.value = {
  //   ...columnSettings.value,
  //   [event.columnName]: {
  //     ...columnSettings.value[event.columnName],
  //     ...event.columnSettings[event.columnName],
  //   }
  // };

  emit('change:column-settings', columnSettings.value);
}

function onContextMenu(event: INewTableRowActionEvent) {
  const rowType = event.row?.meta?.rowType || NEW_TABLE_DEFAULT_ROW_TYPE;

  activeContextMenuItems.value = props.initialContextMenuItems[rowType]
    || props.initialContextMenuItems[NEW_TABLE_DEFAULT_ROW_TYPE];

  if (!activeContextMenuItems.value) {
    return;
  }

  activeContextMenuItems.value =
    generateContextMenuItemsWithPayload(activeContextMenuItems.value, event);

  activeContextMenuMouseEvent.value = event.event as MouseEvent;
}

function onSelectContextMenuItem(menuItem: INewMenuItem) {
  activeContextMenuMouseEvent.value = null;
  emit('select:context-menu-item', menuItem);
}

function onRowDblClick(event) {
  newTableWrapperRef.value.switchOnModeForRow(NEW_TABLE_STANDART_ROW_MODES.EDIT, event.row);
}

function onRowClick(event) {
  emit('row-action', {
    name: 'click',
    row: event.row,
  });
}

function onSideMenuItemClick(menuItem: INewMenuItem) {
  emit('select:side-menu-item', menuItem);
}

function onReestrSettingsAction(event: INewReestrSettingsActionEvent) {
  emit('settings-action', event);
}

function onChangeStartIndex(newStartIndex: number) {
  activeContextMenuMouseEvent.value = null;

  emit('change:start-index', newStartIndex);
}

defineExpose({
  deleteChangedRow: (complexRowId: Partial<INewTableRow>, idFields: string[]) => newTableWrapperRef.value?.deleteChangedRow(complexRowId, idFields),
  switchOnModeForRow: (mode: string, row: INewTableRow) => newTableWrapperRef.value?.switchOnModeForRow(mode, row),
  switchOffModeForRow: (mode: string, row: INewTableRow) => newTableWrapperRef.value?.switchOffModeForRow(mode, row),
});
</script>

<template>
  <div
    class="new-reestr"
    :style="$attrs.style as Partial<StyleValue>"
    :class="$attrs.class"
  >
    <div class="new-reestr__data">
      <!--
        :key="timeStamp"
      -->
      <NewTableWrapper
        ref="newTableWrapperRef"
        class="new-reestr__new-table-wrapper"
        :data="props.initialData"
        :columns="props.initialColumns"
        :columns-settings="columnSettings"
        :filters="props.initialFilters"
        :sorts="props.initialSorts"
        :actions-change-modes="props.initialActionsChangeModes"
        :actions="props.initialActions"
        :isNumberColumnShown="props.isNumberColumnShown"
        :isCheckboxColumnShown="props.isCheckboxColumnShown"
        :isExpandColumnShown="props.isExpandColumnShown"
        :common-meta="props.commonMeta"
        :row-count="rowCount"
        v-bind="$attrs"
        @row-action="$emit('row-action', $event)"
        @change:cell-value="$emit('change:cell-value', $event)"
        @change:column-settings="$emit('change:column-settings', $event)"
        @change:filters="$emit('change:filters', $event)"
        @change:sorts="$emit('change:sorts', $event)"
        @change:start-index="onChangeStartIndex"
        @dblclick.self="onRowDblClick"
        @click.self="onRowClick"
        @contextmenu.self="onContextMenu"
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
      </NewTableWrapper>

      <NewReestrSideMenu
        :sideMenuItems="props.sideMenuItems"
        class="new-reestr__side-menu"
        @select:side-menu-item="onSideMenuItemClick"
      >
        <template #before-side-menu>
          <slot name="before-side-menu" />
        </template>

        <template #after-side-menu>
          <slot name="after-side-menu" />
        </template>
      </NewReestrSideMenu>
    </div>

    <NewReestrSettings
      class="new-reestr-settings"
      :row-count="rowCount"
      :full-data-length="newTableWrapperRef?.fullFlatData?.length || 0"
      :filtered-data-length="newTableWrapperRef?.filteredFlatData?.length || 0"
      @change:row-count="emit('change:row-count', $event)"
      @action="onReestrSettingsAction"
      @open:column-settings="isColumnSettingsShown = true"
    />

    <Teleport
      v-if="isColumnSettingsShown"
      to="body"
    >
      <NewReestrColumnSettingsModal
        :columns="props.initialColumns"
        :columns-settings="columnSettings"
        @change:column-setting="onChangeColumnSetting"
        @close="isColumnSettingsShown = false"
      />
    </Teleport>

    <Teleport
      v-if="activeContextMenuMouseEvent"
      to="body"
    >
      <NewContextMenu
        :menuItems="activeContextMenuItems"
        :menuMouseEvent="activeContextMenuMouseEvent"
        @select:item="onSelectContextMenuItem"
        @close="activeContextMenuMouseEvent = null"
      />
    </Teleport>
  </div>
</template>

<style scoped>
.new-reestr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  flex: 1 1;
  max-height: 100%;

  box-sizing: border-box;
}

.new-reestr__data {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: nowrap;

  flex: 1 1;
  min-height: 0;
  width: 100%;
}

.new-reestr__new-table-wrapper {
  flex: 1 1;
  min-width: 0;
}

.new-reestr__side-menu {
  background-color: var(--color-background-secondary);

  flex: 0 0;
  width: fit-content;
  height: 100%;
}

.new-reestr-settings {
  border-radius: 8px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  width: 100%;
  flex: 0 0;
  color: #0f172a;
  font-weight: 500;
}
</style>
