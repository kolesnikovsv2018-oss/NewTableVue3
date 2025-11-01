<template>
  <div class="default-layout">
    <div class="default-layout__header"></div>
    <div class="default-layout__side-navigation"></div>
    <slot />
  </div>
</template>

<style lang="css" scoped>
.default-layout {
  width: 100%;
  height: 100%;
  padding: 48px 0 0 56px;
  margin: 0;
  box-sizing: border-box;
}

.default-layout__header {
  position: absolute;
  left: 0;
  top: 0;
  /* bottom: 0; */
  right: 0;

  height: 48px;
  background-color: aquamarine;
}

.default-layout__side-navigation {
  position: absolute;
  left: 0;
  top: 48px;
  bottom: 0;
  /* right: 0; */

  width: 56px;
  background-color: cornflowerblue
}
</style>