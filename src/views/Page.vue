<script setup lang="ts">
import Layout from '@/layout/Layout.vue'

</script>

<template>
  <div class="h-full">
    <Layout>
      <template #left>
        <Widget01 />
        <Widget01 />
        <Widget01 />
      </template>
      <template #right>
        <Widget01 />
        <Widget01 />
        <Widget01 />
      </template>
      <template>
        <div class="flex justify-center items-center">中间部分</div>
      </template>
    </Layout>
  </div>
</template>

<style lang="scss" scoped></style>
