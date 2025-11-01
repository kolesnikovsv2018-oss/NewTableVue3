<template>
  <div class="cell">
    <span>{{ props.value || '' }}</span>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  value?: number | string
}>();
</script>

<style scoped>
@import url(./css/cell.css);
</style>
