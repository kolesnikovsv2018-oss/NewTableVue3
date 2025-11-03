<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    thickness?: number,
    color?: string,
    minDivSize?: number,
    currentDiv1Size?: number,
    variant?: 'horizontal' | 'vertical',
  }>(),
  {
    thickness: 5,
    color: 'green',
    minDivSize: 20,
    variant: 'horizontal',
  }
);

const emit = defineEmits<{
  (e: 'update:div1-size', height: number | null): void;
}>();

const splitDiv1 = ref<HTMLElement>();
const splitDiv2 = ref<HTMLElement>();

const currentDiv1Height = ref<number | null>(props.currentDiv1Size ?? null);
const currentDiv1Width = ref<number | null>(props.currentDiv1Size ?? null);

const computedDiv1Style = computed(() => {
  if (props.variant === 'horizontal') {
    return {
      height: props.currentDiv1Size ? `${props.currentDiv1Size}px` : 'auto',
      minHeight: props.currentDiv1Size ? `${props.currentDiv1Size}px` : '0px',
      maxHeight: props.currentDiv1Size ? `${props.currentDiv1Size}px` : 'none',
      flex: props.currentDiv1Size ? `0 0 ${props.currentDiv1Size}px` : '1 1',
    };
  }

  if (props.variant === 'vertical') {
    return {
      width: props.currentDiv1Size ? `${props.currentDiv1Size}px` : 'auto',
      minWidth: props.currentDiv1Size ? `${props.currentDiv1Size}px` : '0px',
      maxWidth: props.currentDiv1Size ? `${props.currentDiv1Size}px` : 'none',
      flex: props.currentDiv1Size ? `0 0 ${props.currentDiv1Size}px` : '1 1',
    };
  }

  return {};
});

let ticky = false;
let deltaY = 0;
let deltaX = 0;
let accumulateDeltaY = 0;
let accumulateDeltaX = 0;
let lastY = 0;
let lastX = 0;

function onMouseDown(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  lastY = event.screenY;
  lastX = event.screenX;
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

  deltaX = event.screenX - lastX;
  lastX = event.screenX;
  accumulateDeltaX += deltaX;

  if (!ticky) {
    ticky = true;
    requestAnimationFrame(() => {
      const computedHeight = splitDiv1.value.getBoundingClientRect().height;
      const computedHeight2 = splitDiv2.value.getBoundingClientRect().height;

      const computedWidth = splitDiv1.value.getBoundingClientRect().width;
      const computedWidth2 = splitDiv2.value.getBoundingClientRect().width;

      currentDiv1Height.value = computedHeight;
      currentDiv1Width.value = computedWidth;

      if (
        props.variant === 'horizontal'
        && (computedHeight + accumulateDeltaY) > props.minDivSize
        && (computedHeight2 - accumulateDeltaY) > props.minDivSize
      ) {
        splitDiv1.value.style.height = `${computedHeight + accumulateDeltaY}px`;
        splitDiv1.value.style.minHeight = `${computedHeight + accumulateDeltaY}px`;
        splitDiv1.value.style.maxHeight = `${computedHeight + accumulateDeltaY}px`;
        splitDiv1.value.style.flexBasis = `${computedHeight + accumulateDeltaY}px`;

        currentDiv1Height.value = computedHeight + accumulateDeltaY;
      }
      if (
        props.variant === 'vertical'
        && (computedWidth + accumulateDeltaX) > props.minDivSize
        && (computedWidth2 - accumulateDeltaX) > props.minDivSize
      ) {
        splitDiv1.value.style.width = `${computedWidth + accumulateDeltaX}px`;
        splitDiv1.value.style.minWidth = `${computedWidth + accumulateDeltaX}px`;
        splitDiv1.value.style.maxWidth = `${computedWidth + accumulateDeltaX}px`;
        splitDiv1.value.style.flexBasis = `${computedWidth + accumulateDeltaX}px`;

        currentDiv1Width.value = computedWidth + accumulateDeltaX;
      }

      accumulateDeltaY = 0;
      accumulateDeltaX = 0;
      ticky = false;
    });
  }
}

function onMouseUp() {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);

  emit('update:div1-size', currentDiv1Height.value);
}
</script>

<template>
  <div
    class="new-splitter__wrapper"
    :class="{
      '--horizontal': variant === 'horizontal',
      '--vertical': variant === 'vertical',
    }"
  >
    <div
      ref="splitDiv1"
      class="split-div1"
      :style="computedDiv1Style"
    >
      <slot name="div1" />
    </div>

    <div
      class="new-splitter__resizer"
      :class="`--${color}`"
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

  box-sizing: border-box;
}

.new-splitter__wrapper.--horizontal {
  flex-direction: column;

  max-height: 100%;
  min-height: 0;
}

.new-splitter__wrapper.--vertical {
  flex-direction: row;

  max-width: 100%;
  min-width: 0;
}


.new-splitter__wrapper .split-div1,
.new-splitter__wrapper .split-div2 {
  flex: 1 1;
  border: 0;
  padding: 0;
  margin: 0;

  box-sizing: border-box;
}

.new-splitter__wrapper.--horizontal .split-div1,
.new-splitter__wrapper.--horizontal .split-div2 {
  width: 100%;
  min-height: 0;
}

.new-splitter__wrapper.--vertical .split-div1,
.new-splitter__wrapper.--vertical .split-div2 {
  height: 100%;
  min-height: 0;
}


.new-splitter__wrapper .new-splitter__resizer {
  box-sizing: border-box;
}

.new-splitter__wrapper.--horizontal .new-splitter__resizer {
  width: 100%;
  border-left: none;
  border-right: none;
  cursor: row-resize;
}

.new-splitter__wrapper.--vertical .new-splitter__resizer {
  height: 100%;
  border-top: none;
  border-bottom: none;
  cursor: col-resize;
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

.--gray {
  background-color: gray;
  border-top: 1px solid #666;
  border-bottom: 1px solid #666;
}

.--orange {
  background-color: orange;
  border-top: 1px solid #e68a00;
  border-bottom: 1px solid #e68a00;
}
</style>