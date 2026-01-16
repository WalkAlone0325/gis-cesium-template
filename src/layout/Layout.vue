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
    height: calc(100% - $header-height);
    background-color: $main-bg-color;
  }

  .main-left {
    position: absolute;
    top: 10px;
    left: 10px;
    box-sizing: border-box;
    display: grid;
    grid-template-rows: repeat(3, calc((100% - 40px) / 3));
    grid-gap: 20px;
    width: $panel-width;
    height: calc(100% - 20px);
    z-index: 999;
  }

  .main-right {
    position: absolute;
    top: 10px;
    right: 10px;
    box-sizing: border-box;
    // display: grid;
    // grid-template-rows: repeat(3, calc((100% - 40px) / 3));
    // grid-gap: 20px;
    width: $panel-width;
    height: calc(100% - 20px);
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 999;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 3px;
    }
  }

  .main-bottom {
    position: absolute;
    bottom: 10px;
    left: calc($panel-width + 20px);
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
    z-index: 9;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background: radial-gradient(circle, transparent 20%, #0c3753 80%);
    }
  }
}
</style>
