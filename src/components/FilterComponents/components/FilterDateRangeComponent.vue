<template>
  <div class="filter-date-range-component">
    <div class="filter-date-range-component__inputs">
      <input
        v-model="date1"
        type="date"
      >
      <input
        v-model="date2"
        type="date"
      >
    </div>

    <div class="filter-date-range-component__actions">
      <button @click="commit">OK</button>
      <button @click="clear">Clear</button>
      <button @click="reset">Reset</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import type { ITestRangeDate } from './types';

defineOptions({
  inheritAttrs: false
});

const props = defineProps<{
  value?: ITestRangeDate;
  defaultValue?: ITestRangeDate;
  initialValue?: ITestRangeDate;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: { date1: string, date2: string }),
  (e: 'input', value: { date1: string, date2: string }),
}>();

const date1 = ref(props.value?.date1 || null);
const date2 = ref(props.value?.date2 || null);

watch(
  () => props.value,
  (v) => {
    date1.value = v?.date1 || null;
    date2.value = v?.date2 || null;
  },
);

watch(
  () => date1.value,
  (v) => emit('input', { date1: date1.value, date2: date2.value }),
);

watch(
  () => date2.value,
  (v) => emit('input', { date1: date1.value, date2: date2.value }),
);

function commit() {
  emit('update:value', { date1: date1.value, date2: date2.value });
}

function clear() {
  date1.value = props.defaultValue?.date1 || null;
  date2.value = props.defaultValue?.date2 || null;
  commit();
}

function reset() {
  date1.value = props.initialValue?.date1 || props.defaultValue?.date1 || null;
  date2.value = props.initialValue?.date2 || props.defaultValue?.date2 || null;
  commit();
}
</script>

<style scoped>
.filter-date-range-component {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: stretch;
  justify-content: flex-start;
  gap: 12px;
  box-sizing: border-box;

  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 0 3px 0 #777;

  background-color: antiquewhite;
}

.filter-date-range-component__inputs {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 8px;
  box-sizing: border-box;
}

.filter-date-range-component__inputs input {
  width: 100%;
  box-sizing: border-box;
  padding: 4px 6px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  color: #333;
}

.filter-date-range-component__actions {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  box-sizing: border-box;
}

.filter-date-range-component__actions button {
  padding: 6px;
  flex: 1 1;
  min-width: 0;
}
</style>
