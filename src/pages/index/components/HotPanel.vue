<script setup lang="ts">
import type { HotList } from '@/pages/types/home'

defineProps<{ list: HotList[] }>()
</script>

<template>
  <view class="hot">
    <view class="body">
      <view class="item" v-for="item in list" :key="item.id">
        <navigator
          :url="`/pages/Recommend/Recommend?type=${item.type}`"
          open-type="navigate"
          hover-class="navigator-hover"
        >
          <view class="text">
            <view class="h1">{{ item.title }}</view>
            <view class="h2">{{ item.alt }}</view>
          </view>
          <view class="img">
            <image :src="item.pictures[0]" mode="aspectFill" />
            <image :src="item.pictures[1]" mode="aspectFill" />
          </view>
        </navigator>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.hot {
  position: relative;
  overflow: hidden;
  background-color: #fff;
  padding: 20rpx 0;
  margin: 20rpx auto;
  width: 95vw;
  border-radius: 30rpx;
  .body {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 25rpx;
    column-gap: 15rpx;
    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 20rpx;
      bottom: 20rpx;
      width: 1rpx;
      background-color: #eee;
    }
    &::after {
      content: '';
      position: absolute;
      left: 20rpx;
      right: 20rpx;
      top: 50%;
      width: 100%;
      height: 1rpx;
      background-color: #eee;
    }
    .item {
      navigator {
        .text {
          display: flex;
          align-items: center;
          margin-bottom: 15rpx;
          .h1 {
            font-size: large;
            margin: 0 30rpx;
          }
          .h2 {
            font-size: small;
            color: $text-color-2;
          }
        }
        .img {
          display: flex;
          justify-content: space-around;
          image {
            width: 150rpx;
            height: 150rpx;
            border-radius: 10rpx;
          }
        }
      }
    }
  }
}
</style>
