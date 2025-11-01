<script setup lang="ts">
import { ref } from 'vue';

import type { INewTableRow } from '../../../NewTable/components/NewTableRow/types/NewTableRowTypes';

defineProps<{
  activeSourceRow: INewTableRow;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'change:destination-row-id', newRowParentId: number): void;
}>();

const newRowParentId = ref<number>(null)

function onSubmitChangeRowParentId() {
  emit('change:destination-row-id', newRowParentId.value)
}
</script>

<template>
  <dialog
    open
    style="z-index: 100;"
  >
    <p>Try to change parent for [{{ activeSourceRow.data.id }}]</p>
    <form
      method="dialog"
      @submit="onSubmitChangeRowParentId"
    >
      <label>
        activeDestinationRowId:
        <input
          v-model.number="newRowParentId"
          type="number"
        >
      </label>
      <div class="dialog-buttons">
        <button
          type="button"
          @click="$emit('close')"
        >Cancel</button>
        <button type="submit">OK</button>
      </div>
    </form>
  </dialog>
</template>