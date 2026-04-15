<script lang="ts" setup>
import { ref } from 'vue'
import { onBackPress } from '@dcloudio/uni-app'
import OrderItem from './components/OrderItem.vue'

// 自定义头部需要手动处理安全区，避免小程序顶部刘海区域覆盖内容。
const { safeAreaInsets } = uni.getSystemInfoSync()

// 订单列表页来自用户页，返回时需要明确回到用户页，不能走默认页面栈回退。
const goUserPage = () => {
  uni.reLaunch({ url: '/pages/user/user' })
}

// 处理微信小程序左上角返回键和系统返回手势，统一跳回用户页。
onBackPress(() => {
  goUserPage()
  return true
})

const orderType = ref([
  { type: 0, name: '全部' },
  { type: 1, name: '待付款' },
  { type: 2, name: '待发货' },
  { type: 3, name: '待收货' },
  { type: 4, name: '待评价' },
])

const activeIndex = ref(0)
const currentIndex = ref(0)

// swiper 切换时同步顶部分类高亮。
const onSwiperChange: UniHelper.SwiperOnChange = (e) => {
  activeIndex.value = e.detail.current
}

// 接收列表类型参数，进入时直接定位到对应分类。
const query = defineProps<{ type?: string }>()
if (query.type) {
  currentIndex.value = Number(query.type)
  activeIndex.value = Number(query.type)
}
</script>

<template>
  <view class="orderClassify" :style="{ 'padding-bottom': safeAreaInsets?.bottom + 'px' }">
    <view
      class="navbar"
      :style="{
        'padding-top': safeAreaInsets?.top === 0 ? '15px' : safeAreaInsets?.top + 'px',
      }"
    >
      <view class="left" @click="goUserPage">
        <uni-icons type="left" size="30" color="#333"></uni-icons>
      </view>
      <view class="title">订单列表</view>
      <view class="right"></view>
    </view>

    <view class="top">
      <view
        v-for="item in orderType"
        :key="item.type"
        class="item"
        :class="{ active: activeIndex === item.type }"
        @click="currentIndex = item.type"
      >
        {{ item.name }}
      </view>
    </view>

    <swiper :current="currentIndex" class="uni-swiper" circular @change="onSwiperChange">
      <swiper-item v-for="item in orderType" :key="item.type">
        <OrderItem :order-type="item.type"></OrderItem>
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss" scoped>
page {
  height: 100%;
}

.orderClassify {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f6f6f6;
  /* #ifdef H5 */
  height: 100%;
  /* #endif */
  /* #ifndef H5 */
  height: 100vh;
  /* #endif */

  .navbar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 24rpx;
    background: #fff;
    border-bottom: 1rpx solid #f0f0f0;

    .left,
    .right {
      width: 84rpx;
      display: flex;
      align-items: center;
    }

    .title {
      font-size: 30rpx;
      font-weight: 600;
      color: #222;
    }
  }

  .top {
    flex-shrink: 0;
    display: flex;
    justify-content: space-around;
    padding: 15rpx 0;
    background: #fff;
    border-bottom: 1rpx solid #f5f5f5;

    .item {
      padding-bottom: 10rpx;
      color: #444;
      font-size: 27rpx;
    }

    .active {
      color: $theme-color;
      border-bottom: 5rpx solid $theme-color;
    }
  }

  .uni-swiper {
    flex: 1;
    min-height: 0;
  }
}
</style>
