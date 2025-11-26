<template>
  <view class="category">
    <view class="item" v-for="item in list" :key="item.id">
      <navigator class="img" url="/pages/" open-type="navigate" hover-class="navigator-hover">
        <image :src="item.icon" mode="aspectFill" />
      </navigator>
      <view class="text">{{ item.name }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CategoryList } from '@/pages/types/home'
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
