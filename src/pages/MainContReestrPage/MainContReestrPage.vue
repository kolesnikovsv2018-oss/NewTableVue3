<script lang="ts" setup>
import { ref } from 'vue';
import NewSplitter from '@/components/NewSplitter/NewSplitter.vue';

const splitterDiv1Height = ref<number | null>(300);

function onUpdateDiv1Size(newSize: number | null) {
  splitterDiv1Height.value = newSize;
}
</script>

<template>
  <div class="main-reestr-page">
    <NewSplitter
      color="green"
      :minDivSize="200"
      :currentDiv1Size="splitterDiv1Height"
      class="main-reestr-page__splitter-wrapper"
      @update:div1-size="onUpdateDiv1Size"
    >

    </NewSplitter>
  </div>
</template>

<style lang="scss" scoped>
.main-reestr-page {
  height: 100%;
  width: 100%;

  &__splitter-wrapper {
    height: 100%;
    width: 100%;
  }
}
</style>