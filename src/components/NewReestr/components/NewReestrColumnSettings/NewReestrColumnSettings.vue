<script setup lang="ts">
import { computed } from 'vue';

import type { INewTableColumn, INewTableColumns, INewTableColumnSetting } from '../../../NewTable/components/NewTableHeader/types/INewTableHeadTypes';
import type { IChangeColumnSettingEvent } from './types';

type TListOfColumnSettings = Record<string, Partial<INewTableColumnSetting & INewTableColumn>>

const props = defineProps<{
  columns: INewTableColumns;
  columnSettings: Record<string, INewTableColumnSetting>;
}>();

const emit = defineEmits<{
  (e: 'change:column-setting', event: IChangeColumnSettingEvent): void
}>()

const listOfColumnSettings = computed<TListOfColumnSettings>(
  (): TListOfColumnSettings => {
    return Object.keys(props.columnSettings || {}).reduce(
      (
        acc: TListOfColumnSettings,
        currentColumnSetttingName: string,
      ): TListOfColumnSettings => {
        const currentColumn = props.columns[currentColumnSetttingName];

        if (!currentColumn) {
          acc[currentColumnSetttingName] = props.columnSettings[currentColumnSetttingName];
        } else {
          acc[currentColumnSetttingName] = {
            ...props.columnSettings[currentColumnSetttingName],
            key: currentColumn.key,
            name: currentColumn.name,
          };
        }

        return acc;
      },
      {}
    );
  }
);

function onChangeVisible(columnName: string, event: Event) {
  const value = (event.target as HTMLInputElement).checked;

  emit('change:column-setting', {
    columnName,
    columnSettings: {
      ...props.columnSettings,
      [columnName]: {
        ...props.columnSettings[columnName],
        visible: !!value,
      },
    }
  });
}
</script>

<template>
  <div class="change-settings">
    <div
      v-for="(columnSetting, columnName) in listOfColumnSettings"
      :key="columnName"
      class="change-settings__item"
    >
      <label>
        <input
          :checked="columnSetting.visible"
          type="checkbox"
          @change="onChangeVisible(columnName, $event)"
        >
        {{ columnName }}
      </label>
    </div>
  </div>
</template>

<style lang="css" scoped>
.change-settings {
  height: 100%;
  overflow-y: scroll;
  width: fit-content;

  flex: 0 0;
}

.change-settings__item {
  text-wrap: nowrap;
}
</style>