<template>
  <div class="filter-select-component">
    <select
      v-model="localValue"
      :multiple="multiple"
      @change="commit"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.name }}
      </option>
    </select>

    <div class="filter-select-component__actions">
      <button @click="commit">OK</button>
      <button @click="clear">Clear</button>
      <button @click="reset">Reset</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps<{
  value?: (number | string)[];
  defaultValue?: (number | string)[];
  initialValue?: (number | string)[];
  options: { value: number | string, name: string }[];
  multiple: boolean;
}>();

const emit = defineEmits(['update:value']);

const localValue = ref(props.value);

watch(
  () => props.value,
  (v) => (localValue.value = v)
);

function commit() {
  emit('update:value', localValue.value)
}

function clear() {
  localValue.value = props.defaultValue || null;
  commit();
}

function reset() {
  localValue.value = props.initialValue || null;
  commit();
}
</script>

<style scoped>
.filter-select-component {
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

.filter-select-component select {
  width: 100%;
  box-sizing: border-box;
  padding: 4px 6px;
  /* background-color: white; */
  background-color: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  color: #333;
}

.filter-select-component select option {
  background-color: rgba(255, 255, 255, 0.4);
}

.filter-select-component__actions {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  box-sizing: border-box;
}

.filter-select-component__actions button {
  padding: 6px;
  flex: 1 1;
  min-width: 0;
}
</style>
