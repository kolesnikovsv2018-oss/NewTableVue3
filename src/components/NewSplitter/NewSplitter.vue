<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    thickness?: number,
    variant?: string,
    minHeight?: number,
  }>(),
  {
    thickness: 5,
    variant: 'green',
    minHeight: 20,
  }
);

const splitDiv1 = ref<HTMLElement>();
const splitDiv2 = ref<HTMLElement>();

let ticky = false;
let deltaY = 0;
let accumulateDeltaY = 0;
let lastY = 0;

function onMouseDown(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  lastY = event.screenY;
}

function onMouseMove(event: MouseEvent) {
  if (!splitDiv1.value || !splitDiv2.value) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  deltaY = event.screenY - lastY;
  lastY = event.screenY;
  accumulateDeltaY += deltaY;

  if (!ticky) {
    ticky = true;
    requestAnimationFrame(() => {
      const computedHeight = splitDiv1.value.getBoundingClientRect().height;
      const computedHeight2 = splitDiv2.value.getBoundingClientRect().height;

      if (
        (computedHeight + accumulateDeltaY) > props.minHeight
        && (computedHeight2 - accumulateDeltaY) > props.minHeight
      ) {
        splitDiv1.value.style.height = `${computedHeight + accumulateDeltaY}px`;
        splitDiv1.value.style.minHeight = `${computedHeight + accumulateDeltaY}px`;
        splitDiv1.value.style.maxHeight = `${computedHeight + accumulateDeltaY}px`;
        splitDiv1.value.style.flexBasis = `${computedHeight + accumulateDeltaY}px`;
      }

      accumulateDeltaY = 0;
      ticky = false;
    });
  }
}

function onMouseUp() {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}
</script>

<template>
  <div class="new-splitter__wrapper">
    <div
      ref="splitDiv1"
      class="split-div1"
    >
      <slot name="div1" />
    </div>

    <div
      class="new-splitter__resizer"
      :class="`--${variant}`"
      :style="{
        height: `${thickness}px`,
        'min-height': `${thickness}px`,
        'max-height': `${thickness}px`,
        flex: `0 0 ${thickness}px`,
      }"
      @mousedown="onMouseDown"
    />

    <div
      ref="splitDiv2"
      class="split-div2"
    >
      <slot name="div2" />
    </div>
  </div>
</template>

<style lang="css" scoped>
.new-splitter__wrapper {
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  flex-direction: column;

  box-sizing: border-box;

  max-height: 100%;
  min-height: 0;
}

.new-splitter__wrapper .split-div1,
.new-splitter__wrapper .split-div2 {
  width: 100%;
  flex: 1 1;
  border: 0;
  padding: 0;
  margin: 0;
  min-height: 0;

  box-sizing: border-box;
}

.new-splitter__wrapper .new-splitter__resizer {
  width: 100%;
  border-left: none;
  border-right: none;
  box-sizing: border-box;
  cursor: row-resize;
}

.--red {
  background-color: red;
  border-top: 1px solid #c33;
  border-bottom: 1px solid #c33;
}

.--green {
  background-color: green;
  border-top: 1px solid #3c3;
  border-bottom: 1px solid #3c3;
}

.--blue {
  background-color: blue;
  border-top: 1px solid #33c;
  border-bottom: 1px solid #33c;
}
</style>