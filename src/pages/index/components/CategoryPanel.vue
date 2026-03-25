<template>
  <view class="category">
    <view class="item" v-for="item in list" :key="item.id" @click="onToClassify(item.id)">
      <view class="img">
        <image :src="item.icon" mode="aspectFill" />
      </view>
      <view class="text">{{ item.name }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useClassifyStore } from '@/stores'
import type { CategoryList } from '@/types/home'

defineProps<{ list: CategoryList[] }>()
const classifyStore = useClassifyStore()

const onToClassify = (id: string) => {
  // 先写入 pinia 持久化状态，再切 tab，分类页可直接按该 id 展示。
  classifyStore.setCurrentClassifyId(id)
  uni.switchTab({
    url: '/pages/classify/classify',
  })
}
</script>

<style scoped lang="scss">
.category {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10rpx;
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
