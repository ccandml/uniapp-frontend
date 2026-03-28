<script lang="ts" setup>
import { ref } from 'vue'
import OrderItem from './components/OrderItem.vue'
import { onBackPress } from '@dcloudio/uni-app'

// 返回时统一返回到用户页
onBackPress(() => {
  uni.reLaunch({ url: '/pages/user/user' })
  return true // 阻止默认返回
})

const orderType = ref([
  { type: 0, name: '全部' },
  { type: 1, name: '待付款' },
  { type: 2, name: '待发货' },
  { type: 3, name: '待收货' },
  { type: 4, name: '待评价' },
])
const activeIndex = ref(0)
// 滑动
const currentIndex = ref(0)
const onSwiperChange: UniHelper.SwiperOnChange = (e) => {
  activeIndex.value = e.detail.current
}

// 接收传参
const query = defineProps<{ type?: string }>()
if (query.type) {
  currentIndex.value = Number(query.type)
  activeIndex.value = Number(query.type)
}
</script>

<template>
  <view class="orderClassify">
    <view class="top">
      <view
        class="item"
        v-for="item in orderType"
        :key="item.type"
        :class="{ active: activeIndex === item.type }"
        @click="currentIndex = item.type"
        >{{ item.name }}</view
      >
    </view>
    <swiper :current="currentIndex" @change="onSwiperChange" class="uni-swiper" circular>
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
  /* #ifdef H5 */
  height: 100%;
  /* #endif */
  /* #ifndef H5 */
  height: 100vh;
  /* #endif */
  display: flex;
  flex-direction: column;
  .top {
    display: flex;
    justify-content: space-around;
    padding: 15rpx 0;
    .item {
      padding-bottom: 10rpx;
    }
    .active {
      border-bottom: 5rpx solid $theme-color;
    }
  }
  .uni-swiper {
    flex: 1;
  }
}
</style>
