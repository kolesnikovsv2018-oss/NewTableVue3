<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  // Optional width of the scrollbar component
  width?: number;
  // Total number of rows in the list
  count: number;
  // Current scroll position (index of the first visible item)
  position?: number;
  // Number of rows visible in the viewport
  rowCount: number;
}>()

const emit = defineEmits<{
  (e: 'change:position', position: number): void;
}>()

const scroller = ref<HTMLElement | null>(null)

const maxCount = computed<number>(
  () => Math.max(props.count - props.rowCount, 0)
);

const bodyHeihjtInPercent = computed<number>(
  () => Math.ceil((props.count / props.rowCount) * 100),
);

let ticky = false;

watch(
  () => props.position,
  (newPosition) => {
    if (newPosition !== undefined) {
      scrollToPositionDebounced(newPosition);
    }
  }
);

onMounted(() => {
  if (props.position !== undefined) {
    scrollToPositionDebounced(props.position);
  }
});

function scrollToPosition(position: number) {
  if (!scroller.value) return;

  const relativePosition = maxCount.value > 0 ? position / maxCount.value : 0;
  const scrollerMaxTop = scroller.value.scrollHeight - scroller.value.clientHeight;

  scroller.value.scrollTop = Math.round(scrollerMaxTop * relativePosition);
}

function scrollToPositionDebounced(position: number) {
  if (ticky) return;
  ticky = true;
  requestAnimationFrame(() => {
    scrollToPosition(position);
    ticky = false;
  });
}

function onScroll() {
  if (!scroller.value || !maxCount.value) return;

  const scrollerMaxTop = scroller.value.scrollHeight - scroller.value.clientHeight;
  if (scrollerMaxTop <= 0) {
    emit('change:position', 0);
    return;
  }
  const relativeScrollPosition = scroller.value.scrollTop / scrollerMaxTop;

  const absolutePosition = Math.round(relativeScrollPosition * maxCount.value);
  emit('change:position', absolutePosition);
}
</script>

<template>
  <div
    ref="scroller"
    :style="{
      height: '100%',
      width: `${width || 16}px`,
      minWidth: `${width || 16}px`,
      maxWidth: `${width || 16}px`,
      overflowY: 'scroll',
      overflowX: 'hidden',
    }"
    class="new-scroll-wrapper"
    @scroll.prevent.stop="onScroll"
  >
    <div
      v-if="maxCount"
      class="new-scroll"
      :style="{
        width: `${width || 16}px`,
        height: `${bodyHeihjtInPercent}%`,
      }"
    />
  </div>
</template>

<style scoped>
.new-scroll-wrapper {
  box-sizing: border-box;
}

.new-scroll {
  box-sizing: border-box;
}
</style>