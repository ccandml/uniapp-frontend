<script setup lang="ts">
import { delOrderAPI, getOrderListAPI } from '@/service/order'
import type { PagesRequest } from '@/types/global'
import type { OrderItem, OrderListResult } from '@/types/order'
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

const query = defineProps<{ orderType: string | number }>()
const pageParams = ref<PagesRequest>({
  page: 1,
  pageSize: 5,
})
// 订单状态
const state: Record<number, string> = {
  1: '待付款',
  2: '待发货',
  3: '待收货',
  4: '待评价',
  5: '已完成',
  6: '已取消',
}
// 请求数据
const orderData = ref<OrderListResult>()
const orderList = ref<OrderItem[]>()
const getOrderList = async () => {
  try {
    const res = await getOrderListAPI({
      ...pageParams.value,
      orderState: Number(query.orderType) || 0,
    })
    // 请求完毕
    if (res.result.items.length < pageParams.value.pageSize) {
      isLoading.value = false
    }
    console.log(res)
    orderData.value = res.result
    orderList.value = [...(orderList.value || []), ...res.result.items]
  } catch (error) {
    // 触底翻页请求失败时回退页码，避免后续漏页
    if (pageParams.value.page > 1) pageParams.value.page--
    throw error
  }
}
// 触底请求
const isLoading = ref(true)
const onScrolltolower = () => {
  if (!isLoading.value) return
  pageParams.value.page++
  getOrderList()
}
// 去订单详情页
const goOrderDetail = (id: string) => {
  uni.navigateTo({ url: `/pagesOrder/orderDetail/orderDetail?id=${id}` })
}
// 删除订单
const delOrder = (id: string) => {
  uni.showModal({
    title: '删除订单后该订单将消失，确定要删除吗？',
    success: async (success) => {
      if (!success.confirm) return
      const res = await delOrderAPI(id)
      console.log(res)
      uni.showToast({ icon: 'success', title: '订单已删除!' })
      // 删除后回到第一页重新拉取，避免列表状态不一致
      pageParams.value.page = 1
      pageParams.value.pageSize = 5
      orderList.value = undefined
      isLoading.value = true
      await getOrderList()
    },
  })
}
// 去评价
const goJudge = () => {
  uni.showToast({ icon: 'success', title: '五星好评！' })
}
// 每次进入页面时重置分页参数，防止重复叠加请求
onShow(() => {
  pageParams.value.page = 1
  pageParams.value.pageSize = 5
  orderList.value = undefined
  isLoading.value = true
  getOrderList()
})
</script>

<template>
  <view class="orderItem">
    <scroll-view @scrolltolower="onScrolltolower" class="scroll" scroll-y>
      <view @click="goOrderDetail(item.id)" class="goods" v-for="item in orderList" :key="item.id">
        <view class="top">
          <view class="time">{{ item.createTime }} {{ state[item.orderState] }}</view>
          <view class="monney">￥ {{ item.payMoney.toFixed(2) }}</view>
        </view>
        <view class="item" v-for="i in item.skus" :key="i.id">
          <view class="left">
            <image :src="i.image" mode="aspectFill" />
          </view>
          <view class="right">
            <view class="title">{{ i.name }}</view>
            <view class="style">{{ i.attrsText }}</view>
            <view class="bottom">
              <view class="price">￥{{ i.curPrice }}</view>
            </view>
          </view>
          <view class="count">x {{ i.quantity }}</view>
        </view>
        <view class="select">
          <view v-if="[1].includes(item.orderState ?? 0)" class="btn right">去付款</view>
          <view
            v-if="[4, 5, 6].includes(item.orderState ?? 0)"
            class="btn left"
            @click.stop="delOrder(item.id)"
            >删除订单</view
          >
          <view v-if="[4, 5, 6].includes(item.orderState ?? 0)" class="btn" @click.stop="goJudge"
            >去评价</view
          >
          <view v-if="[3].includes(item.orderState ?? 0)" class="btn">确认收货</view>
          <view class="btn right">申请售后</view>
        </view>
      </view>
      <view v-if="isLoading" class="loading">加载中...</view>
      <view v-else class="loading">没有更多数据了~</view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.orderItem {
  height: 100%;
  background-color: #eee;

  .scroll {
    height: 100%;
    overflow: auto;
    .goods {
      padding: 10rpx;
      background-color: #fff;
      margin: 10rpx 0;
      border-radius: 15rpx;
      .top {
        display: flex;
        padding: 10rpx 15rpx;
        justify-content: space-between;
        .time {
          color: $text-color-1;
        }
        .monney {
          font-size: 35rpx;
          color: #b30808;
        }
      }
      .item {
        position: relative;
        border-radius: 20rpx;
        padding: 10rpx;
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
            line-clamp: 2;
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
    .loading {
      width: fit-content;
      margin: 0 auto;
      padding: 30rpx;
    }
  }
  .empty {
    width: fit-content;
    padding: 50rpx;
    margin: 0 auto;
    font-size: 33rpx;
    color: $text-color-2;
  }
}
</style>
