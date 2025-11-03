<script setup lang="ts">
import type { INewReestrSettingsActionEvent } from '../../types/newReestrTypes';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

const props = defineProps<{
  rowCount: number;
  fullDataLength: number;
  filteredDataLength: number;
  actions?: {
    name: string;
    label: string;
    payload?: unknown;
  }[];
}>()

const emit = defineEmits<{
  (e: 'change:row-count', rowCount: number): void;
  (e: 'open:column-settings'): void;
  (e: 'action', event: INewReestrSettingsActionEvent): void;
}>()

function onChangeRowCount(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value || 5);
  emit('change:row-count', value);
}

function onRowAction(event: Event) {
  const target = event.target as HTMLSelectElement;
  const name = target.value;
  const payload = props.actions?.find(action => action.name === name)?.payload;
  emit('action', { name, payload });
}
</script>

<template>
  <div class="settings">
    <div class="settings__column-settings">
      <FontAwesomeIcon
        :icon="faGear"
        title="Column Settings"
        @click="$emit('open:column-settings')"
      />
    </div>

    <div
      v-if="!!actions?.length"
      class="settings__actions"
    >
      <select @change="onRowAction">
        <option
          value=""
          disabled
          selected
        >Actions</option>
        <option
          v-for="action in actions"
          :key="action.name"
          :value="action.name"
        >
          {{ action.label }}
        </option>
      </select>
    </div>

    <div class="settings__row-count">
      <label>
        Row count:
        <input
          :value="rowCount"
          type="number"
          @change="onChangeRowCount"
        >
      </label>
    </div>

    <div class="settings__info-item">
      <span>Total</span>
      <span>{{ fullDataLength || 0 }}</span>
    </div>

    <div class="settings__info-item">
      <span>Filtered</span>
      <span>{{ filteredDataLength || 0 }}</span>
    </div>
  </div>
</template>

<style lang="css" scoped>
.settings {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: nowrap;
  padding: 8px;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
}

.settings__column-settings {
  flex: 0 0 auto;
  cursor: pointer;
}

.settings__actions {
  flex: 0 0 auto;
}

.settings__row-count {
  flex: 0 0 auto;
}

.settings__row-count label {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  text-wrap: nowrap;
}

.settings__row-count input {
  width: 100px;
  margin-left: 4px;
  appearance: textfield;
}

.settings__info-item {
  flex: 0 0 auto;
}

.settings__info-item span:first-child {
  margin-right: 4px;
}
</style>
