<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="relative h-full text-[#fff] bg-[#000] bg-op-20">
    <div class="flex items-center h-[40px] bg-no-repeat bg-contain bg-[url('@/assets/images/title2@2x.png')]">
      <div v-if="$slots.header">
        <slot name="header" />
      </div>
      <div v-else class="relative top-[-2px] left-[34px] text-[15px]">{{ title }}</div>
    </div>
    <div class="box-border hidden px-10px pb-10px h-[calc(100%-65px)]">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-panel {
  position: relative;
  height: 100%;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);

  .panel-header {
    display: flex;
    align-items: center;
    height: 40px;
    background-image: url('@/assets/images/title2@2x.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .panel-header-title {
      position: relative;
      top: -2px;
      left: 34px;
      font-size: 15px;
    }
  }

  .panel-body {
    box-sizing: border-box;
    height: calc(100% - 65px);
    padding: 0 10px 10px;
    overflow: hidden;
  }
}
</style>
