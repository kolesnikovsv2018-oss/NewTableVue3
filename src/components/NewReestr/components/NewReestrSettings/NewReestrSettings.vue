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
  <div>
    <div class="settings__column-settingd">
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
.settings__column-settingd {
  display: inline-block;
  cursor: pointer;
  margin-right: 12px;
}

.settings__actions {
  display: inline-block;
  margin-right: 12px;
}

.settings__row-count {
  display: inline-block;
  margin-right: 12px;
}

.settings__info-item {
  display: inline-block;
  margin-right: 12px;
}

.settings__info-item span:first-child {
  margin-right: 4px;
}
</style>
