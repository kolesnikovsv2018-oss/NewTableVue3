<script setup lang="ts">
import { computed, ref } from 'vue';

import type {
  INewMenuItem,
  INewContextMenuXY,
} from './types';
import { useOutsideClickHandler } from '../../composables/useOutsideClickHandler';

const props = defineProps<{
  menuItems: INewMenuItem[];
  // объект события (нажатие правой кнопки мыши), которое вызвало меню
  menuMouseEvent: MouseEvent;
}>()

const emit = defineEmits<{
  (e: 'select:item', menuIrem: INewMenuItem): void
  (e: 'close'): void;
}>()

const xy = computed<INewContextMenuXY>(
  () => ({
    x: props.menuMouseEvent.clientX,
    y: props.menuMouseEvent.clientY,
  })
);

const menu = ref<HTMLElement>();

useOutsideClickHandler(
  () => menu.value,
  onClose,
)

const activeSubMenu = ref<number>(null);

const activeMouseEvent = ref<MouseEvent>(null);

function onClose() {
  emit('close');
}
</script>

<template>
  <div
    ref="menu"
    :style="{
      top: `${xy.y}px`,
      left: `${xy.x}px`,
      position: 'absolute',
    }"
    class="new-context-menu"
  >
    <div
      v-for="(menuItem, idx) in menuItems"
      :key="menuItem.actionName"
      class="new-menu-item"
      style="position: relative;"
      @click="() => { menuItem.actionName ? emit('select:item', menuItem) : null; }"
      @mouseenter="(event) => { activeMouseEvent = event; activeSubMenu = idx; }"
      @mouseleave="() => { activeMouseEvent = null; activeSubMenu = null; }"
    >
      <div class="new-menu-item__block">
        <span class="new-menu-item__lanel">{{ menuItem.label }}</span>
        <span v-if="!!menuItem.children?.length">&gt;</span>
      </div>

      <NewContextMenu
        v-if="!!menuItem.children?.length && activeSubMenu === idx"
        :menu-items="menuItem.children"
        :menu-mouse-event="activeMouseEvent"
        :style="{
          left: '100%',
          top: '0',
        }"
        @select:item="emit('select:item', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.new-context-menu {
  position: absolute;
  /* display: none; */
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.new-context-menu .new-menu-item {
  padding: 10px 15px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.new-context-menu .new-menu-item:hover {
  background-color: #f0f0f0;
}

@media (max-width: 600px) {
  .new-context-menu {
    width: 100%;
  }
}

.new-menu-item__block {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.new-menu-item__lanel {
  text-wrap: nowrap;
}
</style>