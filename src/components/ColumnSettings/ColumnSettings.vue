<script setup lang="ts">
import { computed } from 'vue';

import type { INewTableColumn, INewTableHeaderSetting } from '../NewTable/components/NewTableHeader/types/INewTableHeadTypes';
import type { IChangeColumnSettingsEvent } from './types';

type TListOfColumnSettings = Record<string, Partial<INewTableHeaderSetting & INewTableColumn>>

const props = defineProps<{
  columns: INewTableColumn[];
  columnsSettings: Record<string, INewTableHeaderSetting>;
}>();

const emit = defineEmits<{
  (e: 'change:column-settings', event: IChangeColumnSettingsEvent): void
}>()

const omputedListOfColumnSettings = computed<TListOfColumnSettings>(
  (): TListOfColumnSettings => {
    return Object.keys(props.columnsSettings || {}).reduce(
      (
        acc: TListOfColumnSettings,
        currentColumnSetttingName: string,
      ): TListOfColumnSettings => {
        const currentColumn = props.columns.find(
          (column: INewTableColumn) => column.key === currentColumnSetttingName
        );

        if (!currentColumn) {
          acc[currentColumnSetttingName] = props.columnsSettings[currentColumnSetttingName];
        } else {
          acc[currentColumnSetttingName] = {
            ...props.columnsSettings[currentColumnSetttingName],
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
  emit('change:column-settings', {
    columnName,
    columnsSettings: {
      ...props.columnsSettings[columnName],
      visible: value,
    }
  });
}
</script>

<template>
  <div class="change-settings">
    <div
      v-for="(columnSetting, columnName) in omputedListOfColumnSettings"
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