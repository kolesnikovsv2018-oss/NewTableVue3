<template>
  <div class="filter-text-component">
    <input
      v-model="localValue"
      @change="commit"
    >

    <div class="filter-text-component__actions">
      <button @click="commit">OK</button>
      <button @click="clear">Clear</button>
      <button @click="reset">Reset</button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  value?: string;
  defaultValue?: string;
  initialValue?: string;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: string),
  (e: 'input', value: string),
}>();

const localValue = ref(props.value || '');

watch(
  () => props.value,
  (v) => (localValue.value = v || ''),
);

watch(
  () => localValue.value,
  (v) => emit('input', v),
);

function commit() {
  emit('update:value', localValue.value);
}

function clear() {
  localValue.value = props.defaultValue;
  emit('input', localValue.value);
}

function reset() {
  localValue.value = props.initialValue;
  emit('input', localValue.value);
}
</script>

<style scoped>
.filter-text-component {
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

.filter-text-component input {
  width: 100%;
  box-sizing: border-box;
  padding: 4px 6px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  color: #333;
}

.filter-text-component__actions {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  box-sizing: border-box;
}

.filter-text-component__actions button {
  padding: 6px;
  flex: 1 1;
  min-width: 0;
}
</style>
