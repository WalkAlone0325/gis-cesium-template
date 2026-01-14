<script setup lang="ts">
import Header from './Header.vue'

</script>

<template>
  <div class="layout">
    <Header />
    <div class="layout-main">
      <div class="main-left">
        <slot name="left" />
      </div>
      <div class="main-right">
        <slot name="right" />
      </div>
      <div class="main-bottom">
        <slot name="bottom" />
      </div>
      <div class="main-center">
        <slot name="default" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  background-color: $bg-color;

  .layout-main {
    position: relative;
    width: 100%;
    height: calc(100% - 80px);
    background-color: $main-bg-color;
  }

  .layout-left {
    position: absolute;
    top: 10px;
    left: 10px;
    box-sizing: border-box;
    display: grid;
    grid-template-rows: repeat(3, calc((100% - 40px) / 3));
    grid-gap: 20px;
    width: 400px;
    height: calc(100% - 20px);
    z-index: 999;
  }

  .layout-right {
    position: absolute;
    top: 10px;
    right: 10px;
    box-sizing: border-box;
    display: grid;
    grid-template-rows: repeat(3, calc((100% - 40px) / 3));
    grid-gap: 20px;
    width: 400px;
    height: calc(100% - 20px);
    z-index: 999;
  }

  .main-bottom {
    position: absolute;
    bottom: 10px;
    left: calc(400px + 20px);
    box-sizing: border-box;
    width: calc(100% - 840px);
    height: 300px;
    z-index: 999;
  }

  .main-center {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background: radial-gradient(circle, transparent 30%, #0F151F 70%);
    }
  }
}
</style>
