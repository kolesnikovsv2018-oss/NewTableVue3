<template>
  <div class="cell">
    <template v-if="mode === 'edit'">
      <input
        v-model="localValue"
        @change="commit"
        @input="$emit('input', localValue)"
      >
    </template>
    <template v-else>
      <span>{{ value }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps<{
  value?: string
  mode?: 'view' | 'edit'
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
</script>

<style scoped>
@import url(./css/cell.css);
@import url(css/components.css);
</style>
