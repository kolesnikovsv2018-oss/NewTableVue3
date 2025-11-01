<template>
  <div class="cell">
    <template v-if="mode === 'edit'">
      <input
        v-model.number="localValue"
        type="number"
        @change="commit"
        @input="$emit('input', localValue)"
      >
    </template>
    <template v-else>
      <span>
        {{ formatted }}
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  value?: number
  mode?: 'view' | 'edit'
}>();

const emit = defineEmits<{
  (e: 'update:value', value: number),
  (e: 'input', value: number),
}>();

const localValue = ref<number>(props.value || 0);

watch(
  () => props.value,
  (v) => (localValue.value = v)
);

const formatted = computed(() => {
  const v = Number(props.value || 0);

  if (Number.isNaN(v)) return '';

  return v.toLocaleString()
});

function commit() {
  emit('update:value', Number(localValue.value))
}
</script>

<style scoped>
@import url(./css/cell.css);
@import url(css/components.css);
</style>
