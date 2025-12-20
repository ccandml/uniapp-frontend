<template>
  <view class="category">
    <view class="item" v-for="item in list" :key="item.id">
      <view class="img">
        <image :src="item.icon" mode="aspectFill" />
      </view>
      <view class="text">{{ item.name }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CategoryList } from '@/types/home'
import { ref } from 'vue'

defineProps<{ list: CategoryList[] }>()
</script>

<style scoped lang="scss">
.category {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15rpx;
  margin-top: 30rpx;
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    .img {
      width: 100rpx;
      height: 100rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .text {
    color: $text-color-1;
  }
}
</style>
