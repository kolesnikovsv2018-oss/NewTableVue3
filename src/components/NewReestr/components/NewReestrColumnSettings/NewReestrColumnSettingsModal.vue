<script setup lang="ts">
import { ref } from 'vue';

import type {
  INewTableColumn,
  INewTableColumnSettings
} from '../../../NewTable/components/NewTableHeader/types/INewTableHeadTypes';
import type { IChangeColumnSettingEvent } from './types';

import { useOutsideClickHandler } from '../../../../composables/useOutsideClickHandler';

import NewReestrColumnSettings from './NewReestrColumnSettings.vue';

defineProps<{
  columns: INewTableColumn[];
  columnsSettings: INewTableColumnSettings;
}>();

const emit = defineEmits<{
  // отправляется сразу как поменялось одно значение видимости колонки
  // настройка именно одной колонки
  (e: 'change:column-setting', event: IChangeColumnSettingEvent): void;
  (e: 'close'): void;
}>();

const el = ref();

useOutsideClickHandler(
  () => el.value,
  close,
);

function close() {
  emit('close');
}
</script>

<template>
  <div
    ref="el"
    class="new-reestr-column-settings-modal"
  >
    <div class="new-reestr-column-settings-modal__header">
      <h3>Column Settings</h3>
      <button @click="close">X</button>
    </div>
    <div class="new-reestr-column-settings-modal__body">
      <NewReestrColumnSettings
        :columns="columns"
        :columnSettings="columnsSettings"
        @change:column-setting="(event: IChangeColumnSettingEvent) => {
          emit('change:column-setting', event);
        }"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('../../../../styles/variables.css');

.new-reestr-column-settings-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
  z-index: 1000;
  color: var(--app-text-primary)
}

.new-reestr-column-settings-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.new-reestr-column-settings-modal__body {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}
</style>