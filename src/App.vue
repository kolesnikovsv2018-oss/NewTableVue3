<script setup lang="ts">
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout.vue';
</script>

<template>
  <DefaultLayout class="app">
    <router-view />
  </DefaultLayout>
</template>

<style scoped>
.app {}
</style>
