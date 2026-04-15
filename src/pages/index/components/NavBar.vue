<script setup>
const { safeAreaInsets } = uni.getSystemInfoSync()

const goSearch = () => {
  uni.navigateTo({ url: '/pages/search/search' })
}
</script>

<template>
  <view class="navbar" :style="{ 'padding-top': safeAreaInsets?.top + 'px' }">
    <view class="top">
      <text class="title">晨曦优选</text>
      <text class="subtitle">新鲜 · 亲民 · 快捷</text>
    </view>
    <view class="search" @click="goSearch">
      <view class="left">
        <uni-icons type="search" size="20" color="white"></uni-icons>
        <text>搜索商品</text>
      </view>
      <view class="right">
        <uni-icons type="scan" size="20" color="white"></uni-icons>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.navbar {
  padding: 20rpx 0;
  background: url(@/static/images/navigator_bg.png) no-repeat;
  .top {
    padding: 20rpx;
    display: flex;
    align-items: center;
    .title {
      color: #fff;
      font-family: 'HuaWen XingKai', 'Microsoft YaHei', serif;
      font-weight: 500;
      font-size: 40rpx;
      margin: 0 10rpx 0 0;
      letter-spacing: 2rpx;
    }
    .subtitle {
      border-left: 1px solid white;
    }
    image {
      width: 166rpx;
      height: 39rpx;
      margin: 0 20rpx;
    }
    text {
      padding: 0 20rpx;
      color: #fff;
      font-size: 26rpx;
    }
  }
  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 20rpx;
    padding: 0 20rpx;
    height: 65rpx;
    border-radius: 60rpx;
    background-color: rgba($color: #fff, $alpha: 0.6);
    .left {
      display: flex;
      align-items: center;
    }
    text {
      color: #fff;
      font-size: 30rpx;
    }
  }
}
</style>
