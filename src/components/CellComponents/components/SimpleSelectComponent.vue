<template>
  <div class="cell">
    <template v-if="mode === 'edit'">
      <select
        v-model="localValue"
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
    </template>
    <template v-else>
      <span>{{ pretty }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps<{
  value?: number | string
  mode?: 'view' | 'edit'
  options: { value: number | string, name: string }[]
}>();

const emit = defineEmits(['update:value']);

const localValue = ref(props.value);

watch(() => props.value, (v) => (localValue.value = v));

const pretty = computed(() => {
  if (!props.value) return '';

  return props.options.find(
    (option) => option.value === props.value,
  )?.name || '';
});

function commit() {
  emit('update:value', localValue.value)
}
</script>

<style scoped>
@import url(./css/cell.css);
@import url(css/components.css);
</style>
