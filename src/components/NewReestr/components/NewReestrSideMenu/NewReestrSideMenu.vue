<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { INewMenuItem } from '../../../NewContextMenu/types';

const props = defineProps<{
  sideMenuItems?: INewMenuItem[];
  showLabels?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select:side-menu-item', menuIrem: INewMenuItem): void;
}>();

function onSideMenuItemClick(menuItem: INewMenuItem) {
  emit('select:side-menu-item', menuItem);
}
</script>

<template>
  <div
    v-if="!!sideMenuItems?.length"
    class="new-reestr__side-menu"
  >
    <slot name="before-side-menu" />
    <div class="new-reestr__side-menu__items">
      <div
        v-for="(menuItem) in sideMenuItems"
        :key="menuItem.actionName"
        class="new-reestr__side-menu__item"
        @click="onSideMenuItemClick(menuItem)"
      >
        <FontAwesomeIcon
          v-if="menuItem.icon"
          :title="menuItem.label"
          :icon="menuItem.icon"
          class="new-reestr__side-menu__item-icon"
        />
        <span
          v-else-if="!menuItem.label || props.showLabels"
          class="new-reestr__side-menu__item-label"
        >
          {{ menuItem.label }}
        </span>
      </div>
    </div>
    <slot name="after-side-menu" />
  </div>
</template>

<style lang="css" scoped>
.new-reestr__side-menu {
  --side-menu-item-icon-font-size: 20px;
  --side-menu-item-color-background-hover: #f1f5f9;
  --side-menu-item-color-hover: #1e293b;

  position: relative;
  box-sizing: border-box;
}

.new-reestr__side-menu__items {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
  padding: 6px;
}

.new-reestr__side-menu__item {
  cursor: pointer;

  border-radius: 4px;
  transition: background-color 0.3s;
  transition: color 0.3s;
  text-align: center;

  padding: 0.2rem;
  box-sizing: border-box;
}

.new-reestr__side-menu__item:hover {
  background-color: var(--side-menu-item-color-background-hover);
  color: var(--side-menu-item-color-hover);
}

.new-reestr__side-menu__item-icon {
  font-size: var(--side-menu-item-icon-font-size);
}

.new-reestr__side-menu__item-label {
  font-size: 14px;
}
</style>