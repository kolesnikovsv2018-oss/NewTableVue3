<script setup lang="ts">
import { ref } from 'vue';

import { useOutsideClickHandler } from '../../../../composables/useOutsideClickHandler';

const el = ref();

useOutsideClickHandler(
  () => el.value,
  close,
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function close() {
  emit('close');
}
</script>

<template>
  <div
    ref="el"
    class="new-reestr-side-menu-wrapper"
  >
    <slot />
  </div>
</template>

<style lang="css" scoped>
.new-reestr-side-menu-wrapper {
  position: absolute;
  background-color: var(--app-panel-bg);
  z-index: var(--app-z-tooltip);
  right: 100%;
  height: 100%;
  padding: var(--app-content-padding);
  box-sizing: border-box;
  border-radius: var(--app-button-radius);
  border: 1px solid var(--app-panel-border);
  box-shadow: var(--app-shadow-md);
}
</style>
