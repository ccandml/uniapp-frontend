<script lang="ts" setup>
import {
  collectTransportAPI,
  delOrderAPI,
  getOrderDetailAPI,
  getTransportDetailAPI,
  payAPI,
  transportAPI,
} from '@/service/order'
import type { LogisticItem, OrderResult } from '@/types/order'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
// 安全区
const { safeAreaInsets } = uni.getSystemInfoSync()
// 接收传参
const query = defineProps<{ id: string }>()
// 返回
const goBack = () => {
  uni.navigateBack({ delta: 2 })
}
// 获取订单详情
const orderData = ref<OrderResult>()
const getOrderDetail = async () => {
  uni.showLoading({ mask: true, title: '全力加载中...' })
  const res = await getOrderDetailAPI(query.id)
  console.log(res)
  orderData.value = res.result
  orderState.value = state[res.result.orderState]
  // 获取物流信息
  await getTransportDetail()
  uni.hideLoading()
}
// 订单状态
const state: Record<number, string> = {
  1: '等待付款',
  2: '等待发货',
  3: '等待收货',
  4: '等待评价',
  5: '已完成',
  6: '已取消',
}
const orderState = ref<string>()
// 订单超时
const onTimeup = () => {
  orderState.value = state[6]
}
// 支付
const goPay = () => {
  uni.showModal({
    title: '模拟付款',
    success: async (success) => {
      if (success.confirm) {
        const res = await payAPI(query.id)
        // 刷新页面
        await getOrderDetail()
        uni.showToast({
          icon: 'success',
          title: '支付成功!',
        })
        setTimeout(() => {
          uni.reLaunch({ url: '/pagesOrder/orderClassify/orderClassify?type=2' })
        }, 1000)
        console.log(res)
      }
    },
  })
}
// 发货
const onTransport = () => {
  uni.showModal({
    title: '模拟发货',
    success: async (success) => {
      if (success.confirm) {
        const res = await transportAPI(query.id)
        uni.showToast({
          icon: 'success',
          title: '发货成功!',
        })
        setTimeout(() => {
          uni.reLaunch({ url: '/pagesOrder/orderClassify/orderClassify?type=3' })
        }, 1000)
        console.log(res)
      }
    },
  })
}
// 评价
const goJudge = () => {
  uni.showToast({ icon: 'success', title: '五星好评！' })
}
// 确认收货
const onCollect = () => {
  uni.showModal({
    title: '为了保障您的权益，请确认订单无误后再确认收货',
    success: async (success) => {
      if (success.confirm) {
        const res = await collectTransportAPI(query.id)
        console.log(res)
        // 刷新页面
        await getOrderDetail()
        uni.showToast({
          icon: 'success',
          title: '订单已完成!',
        })
        setTimeout(() => {
          uni.reLaunch({ url: '/pagesOrder/orderClassify/orderClassify?type=4' })
        }, 1000)
      }
    },
  })
}
// 删除订单
const delOrder = () => {
  uni.showModal({
    title: '删除订单后该订单将消失，确定要删除吗？',
    success: async (success) => {
      if (success.confirm) {
        const res = await delOrderAPI(query.id)
        uni.showToast({
          icon: 'success',
          title: '订单已删除!',
        })
        console.log(res)
        // 跳转页面
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
      }
    },
  })
}
// 获取物流信息
const transportDetail = ref<LogisticItem[]>()
const getTransportDetail = async () => {
  if ([3, 4, 5].includes(orderData.value!.orderState)) {
    const res = await getTransportDetailAPI(query.id)
    console.log(res)
    transportDetail.value = [...res.result.list].reverse() //倒叙数组
  }
}
onLoad(() => {
  console.log(query.id)
  getOrderDetail()
})
</script>

<template>
  <view class="orderDetail" :style="{ 'padding-bottom': safeAreaInsets?.bottom + 'px' }">
    <view
      class="navbar"
      :style="{ 'padding-top': safeAreaInsets?.top === 0 ? 15 + 'px' : safeAreaInsets?.top + 'px' }"
    >
      <view @click="goBack" class="left"
        ><uni-icons type="left" size="30" color="#fff"></uni-icons>
      </view>
      <view class="title">订单详情</view>
    </view>
    <scroll-view class="scroll" scroll-y>
      <view
        class="top"
        :style="{
          'padding-top': safeAreaInsets?.top === 0 ? 15 + 'px' : safeAreaInsets?.top + 'px',
        }"
      >
        <view class="title">{{ orderState }}</view>
        <view class="message" v-if="orderData?.orderState === 1">
          <view class="text"> 应付金额：￥{{ orderData?.payMoney.toFixed(2) }} </view>
          <uni-countdown
            :second="orderData?.countdown"
            :showDay="false"
            :showHour="false"
            color="#fff"
            splitorColor="#fff"
            :showColon="false"
            :font-size="15"
            @timeup="onTimeup"
          />
        </view>
        <view v-if="orderData?.orderState === 1" @click="goPay" class="btn">去支付</view>
        <view v-if="orderData?.orderState === 2" @click="onTransport" class="btn">模拟发货</view>
        <view v-if="orderData?.orderState === 3" @click="onCollect" class="btn">确认收货</view>
        <view v-if="orderData?.orderState === 4" @click="goJudge" class="btn">去评价</view>
      </view>
      <view class="address">
        <template v-if="[4, 5, 3].includes(orderData?.orderState ?? 0)">
          <view class="item" v-for="item in transportDetail" :key="item.id">
            <image src="../../static/images/car.png" mode="aspectFit" />
            <view>
              <view class="data">{{ item.text }}</view>
              <view class="time">{{ item.time }}</view>
            </view>
          </view>
        </template>

        <view class="item">
          <image src="../../static/images/locate.png" mode="aspectFit" />
          <view>
            <view class="data"
              >{{ orderData?.receiverContact }} {{ orderData?.receiverMobile }}
            </view>
            <view class="time">{{ orderData?.receiverAddress }}</view>
          </view>
        </view>
      </view>
      <view class="goods">
        <view class="item" v-for="item in orderData?.skus" :key="item.id">
          <view class="left">
            <image :src="item.image" mode="aspectFill" />
          </view>
          <view class="right">
            <view class="title">{{ item.name }}</view>
            <view class="style">{{ item.attrsText }}</view>
            <view class="bottom">
              <view class="price">￥{{ item.curPrice.toFixed(2) }}</view>
            </view>
          </view>
          <view class="count">x {{ item.quantity }}</view>
        </view>
        <view class="select">
          <view
            @click="delOrder"
            v-if="[4, 5, 6].includes(orderData?.orderState ?? 0)"
            class="btn left"
            >删除订单</view
          >
          <view v-if="orderData?.orderState === 4" @click="goJudge" class="btn">去评价</view>
          <view class="btn right">申请售后</view>
        </view>
      </view>
      <view class="summary">
        <view class="item">
          <view>商品总价：</view>
          <view>￥{{ orderData?.totalMoney.toFixed(2) }}</view>
        </view>
        <view class="item">
          <view>运费：</view>
          <view>￥{{ orderData?.postFee.toFixed(2) }}</view>
        </view>
        <view class="item">
          <view>应付金额：</view>
          <view class="price">￥{{ orderData?.payMoney.toFixed(2) }}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.orderDetail {
  .navbar {
    position: fixed;
    z-index: 2;
    display: flex;
    align-items: center;
    padding: 10rpx;

    width: 100%;
    .left {
      width: 42vw;
    }
    .title {
      opacity: 0;
    }
  }
  .scroll {
    .top {
      background: url(../../static/images/order_bg.png) no-repeat;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30rpx 0;
      min-height: 200rpx;
      .title {
        padding: 20rpx;
        font-size: 34rpx;
        color: #fff;
      }
      .message {
        display: flex;
        align-items: center;
        .text {
          color: #fff;
          padding-right: 15rpx;
        }
      }
      .btn {
        color: $theme-color;
        background-color: #fff;
        padding: 10rpx 55rpx;
        margin: 20rpx;
        border-radius: 30rpx;
      }
    }
    .address {
      padding: 30rpx;
      .item {
        display: flex;
        align-items: center;
        padding: 10rpx 0;
        image {
          flex-shrink: 0;
          width: 60rpx;
          height: 60rpx;
          margin-right: 20rpx;
        }
        .data {
          font-size: 27rpx;
        }
        .time {
          font-size: 25rpx;
        }
      }
    }
    .goods {
      padding: 0 15rpx;
      .item {
        position: relative;
        border-radius: 20rpx;
        padding: 10rpx;
        background-color: #fff;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        &:last-child {
          border: none;
        }
        .left {
          width: 180rpx;
          height: 180rpx;
          margin-right: 10rpx;
          flex-shrink: 0;
          image {
            width: 100%;
            height: 100%;
            border-radius: 10rpx;
          }
        }
        .right {
          align-self: baseline;
          .title {
            height: 80rpx;
            overflow: hidden;
            display: -webkit-box; // 弹性盒子模型
            -webkit-box-orient: vertical; // 垂直方向
            -webkit-line-clamp: 2; // 显示2行
            text-overflow: ellipsis;
          }
          .style {
            margin: 10rpx 0;
            font-size: 25rpx;
            color: $text-color-2;
            background-color: #eee;
            padding: 0 15rpx;
            border-radius: 8rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: fit-content;
            max-width: 400rpx;
          }
          .bottom {
            width: 400rpx;
            position: relative;
            display: flex;
            flex-wrap: wrap;
            .price {
              color: rgb(179, 8, 8);
              padding: 0 15rpx;
            }
            .oldPrice {
              text-decoration: line-through;
              color: $text-color-2;
            }
          }
        }
        .count {
          position: absolute;
          right: 20rpx;
        }
      }
      .select {
        margin: 20rpx 0;
        display: flex;
        justify-content: flex-end;
        width: 100%;
        .btn {
          border: 2rpx solid #ccc;
          padding: 5rpx 28rpx;
          border-radius: 30rpx;
          margin: 0 10rpx;
        }
        .right {
          border-color: $theme-color;
          color: $theme-color;
        }
        .left {
          border-color: #b30808;
          color: #b30808;
        }
      }
    }
    .summary {
      .item {
        display: flex;
        justify-content: space-between;
        padding: 5rpx 25rpx;
      }
      .price {
        font-size: 36rpx;
        color: #b30808;
      }
    }
  }
}
</style>
