<script setup lang="ts">
import { ref, watch } from 'vue';

import { useOutsideClickHandler } from '../../../../composables/useOutsideClickHandler';

import NewReestrSideMenuWrapper from '../NewReestrSideMenuWrapper/NewReestrSideMenuWrapper.vue';

const el = ref();

useOutsideClickHandler(
  () => el.value,
  close,
);

const props = defineProps<{
  payload?: unknown,
  date?: string
}>();

const emit = defineEmits<{
  (e: 'submit', event: { value: string, payload?: unknown, }): void;
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
  <NewReestrSideMenuWrapper @close="close">
    <form
      class="new-reestr__side-menu__wrapper__form"
      @submit="emit(
        'submit',
        {
          value: value, // ($event.target as HTMLInputElement).value,
          payload: props.payload,
        }
      )"
    >
      <input
        v-model="value"
        type="date"
      />

      <div style="flex: 1 1;" />

      <button
        :disabled="!value"
        type="submit"
      >Submit</button>
    </form>
  </NewReestrSideMenuWrapper>
</template>

<style lang="css" scoped>
.new-reestr__side-menu__wrapper__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}
</style>