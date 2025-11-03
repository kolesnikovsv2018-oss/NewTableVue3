<script setup lang="ts">
import DefaultLayoutHeader from './components/DefaultLayoutHeader/DefaultLayoutHeader.vue';
import DefaultLayoutSideNavigation from './components/DefaultLayoutSideNavigation/DefaultLayoutSideNavigation.vue'
</script>

<template>
  <div class="default-layout">
    <DefaultLayoutHeader class="default-layout__header">
      <template #default>
        <slot name="header" />
      </template>
    </DefaultLayoutHeader>

    <DefaultLayoutSideNavigation class="default-layout__side-navigation">
      <template #default>
        <slot name="side-navigation" />
      </template>
    </DefaultLayoutSideNavigation>

    <slot />
  </div>
</template>

<style lang="css" scoped>
.default-layout {
  width: 100%;
  height: 100%;
  /* leave space for header and sidebar */
  padding: var(--app-header-height) 0 0 var(--app-sidebar-width);
  margin: 0;
  box-sizing: border-box;
  background-color: var(--app-body-bg);
  color: var(--app-text-primary);
}

.default-layout__header {
  position: absolute;
  left: 0;
  top: 0;
  /* bottom: 0; */
  right: 0;
  height: var(--app-header-height);
  background-color: var(--app-panel-bg);
  border-bottom: 1px solid var(--app-panel-border);
  box-shadow: var(--app-shadow-sm);
}

.default-layout__side-navigation {
  position: absolute;
  left: 0;
  top: var(--app-header-height);
  bottom: 0;
  /* right: 0; */
  width: var(--app-sidebar-width);
  background-color: var(--app-sidebar-bg);
  border-right: 1px solid var(--app-sidebar-border);
}
</style>