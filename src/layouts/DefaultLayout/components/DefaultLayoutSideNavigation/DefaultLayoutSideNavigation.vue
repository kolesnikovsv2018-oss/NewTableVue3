<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const navItems = [
  { name: 'Home', icon: faHome },
  { name: 'TestPage1', icon: faFile },
  // { name: 'Settings', icon: faCog },
  // { name: 'Messages', icon: faEnvelope },
  // { name: 'Notifications', icon: faBell },
];
</script>

<template>
  <div>
    <slot>
      <nav class="side-nav__inner">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          class="side-nav__item"
          :to="{ name: item.name }"
        >
          <FontAwesomeIcon
            :icon="item.icon"
            class="side-nav__icon"
          />
          <span
            v-if="!item.icon"
            class="side-nav__label"
          >{{ item.name }}</span>
        </RouterLink>
      </nav>
    </slot>
  </div>
</template>

<style scoped>
.side-nav__inner {
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
  padding: var(--app-sidebar-padding);
  box-sizing: border-box;
}

.side-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border-radius: var(--app-button-radius);
  color: var(--app-sidebar-text);
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease;
  padding: var(--app-sidebar-item-padding);
}

.side-nav__item:hover {
  background-color: var(--app-sidebar-hover-bg);
}

.side-nav__icon {
  font-size: var(--app-sidebar-icon-size);
  color: var(--app-sidebar-icon);
}

.side-nav__label {
  font-weight: 500;
}

/* Active route styling */
.side-nav__item.router-link-active,
.side-nav__item.router-link-exact-active {
  background-color: var(--app-sidebar-active-bg);
  color: var(--app-text-primary);
}

.side-nav__item.router-link-active .side-nav__icon,
.side-nav__item.router-link-exact-active .side-nav__icon {
  color: var(--app-sidebar-icon-active);
}
</style>