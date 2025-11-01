<script setup lang="ts">
import { ref, watch } from 'vue';
import { useOutsideClickHandler } from '../../../../composables/useOutsideClickHandler';

const el = ref();

useOutsideClickHandler(
  () => el.value,
  close,
);

const props = defineProps<{
  payload?: any,
  date?: string
}>();

const emit = defineEmits<{
  (e: 'submit', event: { value: any, payload?: any, }): void;
  (e: 'close'): void;
}>();

const value = ref<string>(props.date);

watch(
  () => props.date,
  (newDate) => value.value = newDate,
);

function close() {
  emit('close');
}
</script>

<template>
  <div
    ref="el"
    class="new-reestr-side-menu-date-filter"
  >
    <form @submit="emit(
      'submit',
      {
        value: value, // ($event.target as HTMLInputElement).value,
        payload: props.payload,
      }
    )">
      <input
        v-model="value"
        type="date"
      />

      <button
        :disabled="!value"
        type="submit"
      >Submit</button>
    </form>
  </div>
</template>

<style lang="css" scoped>
.new-reestr-side-menu-date-filter {
  position: absolute;
  background-color: antiquewhite;
  z-index: 1001;
  right: 100%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 6px;
  box-shadow: 0 0 5px 1px #777;
}
</style>