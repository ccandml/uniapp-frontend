<template>
  <view class="skeleton">
    <!-- 轮播骨架 -->
    <view class="s-banner">
      <view class="s-swiper"></view>
      <view class="s-dots">
        <view v-for="i in 5" :key="i" class="s-dot" :class="{ active: i === 2 }" />
      </view>
    </view>

    <!-- 分类宫格骨架 -->
    <view class="s-category">
      <view v-for="i in 10" :key="i" class="s-c-item">
        <view class="s-c-img" />
        <view class="s-c-text" />
      </view>
    </view>

    <!-- 热门板块骨架 -->
    <view class="s-hot">
      <view v-for="i in 4" :key="i" class="s-h-item">
        <view class="s-h-text">
          <view class="s-h-title" />
          <view class="s-h-desc" />
        </view>
        <view class="s-h-imgs">
          <view class="s-h-img" />
          <view class="s-h-img" />
        </view>
      </view>
    </view>

    <!-- 猜你喜欢骨架 -->
    <view class="s-guess">
      <view class="s-g-top">
        <view class="s-g-icon" />
        <view class="s-g-title" />
        <view class="s-g-icon" />
      </view>
      <view class="s-g-list">
        <view v-for="i in 4" :key="i" class="s-g-item">
          <view class="s-g-img" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* 骨架屏主色调 */
.skeleton {
  background-color: #fff;
  padding: 20rpx;
}

/* 通用动画 */
.s-swiper,
.s-dot,
.s-c-img,
.s-c-text,
.s-h-title,
.s-h-desc,
.s-h-img,
.s-g-icon,
.s-g-title,
.s-g-img {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shine 1.2s infinite;
  border-radius: 8rpx;
}

@keyframes shine {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 轮播 */
.s-banner {
  position: relative;
  height: 300rpx;
  margin-bottom: 20rpx;
}
.s-swiper {
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
}
.s-dots {
  position: absolute;
  bottom: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8rpx;
}
.s-dot {
  width: 30rpx;
  height: 6rpx;
  opacity: 0.3;
}
.s-dot.active {
  opacity: 1;
}

/* 分类 */
.s-category {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
}
.s-c-item {
  text-align: center;
}
.s-c-img {
  width: 100rpx;
  height: 100rpx;
  margin: 0 auto 10rpx;
  border-radius: 50%;
}
.s-c-text {
  width: 80rpx;
  height: 24rpx;
  margin: 0 auto;
}

/* 热门 */
.s-hot {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
}
.s-h-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  background: #fff;
  border-radius: 16rpx;
}
.s-h-text {
  flex: 1;
  margin-right: 20rpx;
}
.s-h-title {
  width: 120rpx;
  height: 32rpx;
  margin-bottom: 10rpx;
}
.s-h-desc {
  width: 80rpx;
  height: 24rpx;
}
.s-h-imgs {
  display: flex;
  gap: 10rpx;
}
.s-h-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
}

/* 猜你喜欢 */
.s-guess {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
}
.s-g-top {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}
.s-g-icon {
  width: 30rpx;
  height: 30rpx;
  margin: 0 10rpx;
}
.s-g-title {
  width: 120rpx;
  height: 30rpx;
}
.s-g-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}
.s-g-img {
  width: 100%;
  height: 310rpx;
  border-radius: 12rpx;
}
</style>
