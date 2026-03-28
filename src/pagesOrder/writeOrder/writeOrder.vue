<script lang="ts" setup>
import { getOrderNowAPI, getOrderPreAPI, submiteOrderAPI } from '@/service/order'
import { useAddressStore } from '@/stores'
import type { OrderPreResult } from '@/types/order'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
// 安全区
const basePaddingBottom = 30
const finalPaddingBottom = ref(`${basePaddingBottom}rpx`)
/* #ifndef H5 */
const systemInfo = uni.getSystemInfoSync()
const safeAreaBottomPx = systemInfo.screenHeight - (systemInfo.safeArea?.bottom || 0)
const safeAreaBottomRpx = (safeAreaBottomPx * 750) / systemInfo.screenWidth
finalPaddingBottom.value = `${10 + safeAreaBottomRpx}rpx`
/* #endif */
// 收货地址
const addressStore = useAddressStore()
const addressParams = computed(() => {
  return addressStore.addressSelectedItem
    ? addressStore.addressSelectedItem.fullLocation +
        ' ' +
        addressStore.addressSelectedItem.address +
        ' ' +
        addressStore.addressSelectedItem.receiver +
        ' ' +
        addressStore.addressSelectedItem.contact
    : '请选择收货地址'
})

// 表单
const range = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
enum pickerNum {
  all = 1,
  workday = 2,
  weekday = 3,
}
const pickerParams = ref<pickerNum>(pickerNum.all)
const pickerValue = ref()
const pickerChange: UniHelper.PickerViewOnChange = (e) => {
  pickerValue.value = range[Number(e.detail.value)]
  pickerParams.value = Number(e.detail.value) > 4 ? pickerNum.weekday : pickerNum.workday
  console.log(pickerParams.value)
}
const inputValue = ref()

// 获取预订单信息
const orderData = ref<OrderPreResult>()
const getOrderPre = async () => {
  if (query.skuId) {
    // 未选择地址时也允许进入预览页，addressId 按后端可选参数传递
    const res = await getOrderNowAPI({
      skuId: query.skuId,
      count: query.count,
      addressId: addressStore.addressSelectedItem?.id,
    })
    console.log(res)
    orderData.value = res.result
  } else {
    const res = await getOrderPreAPI()
    console.log(res)
    orderData.value = res.result
  }
}
// 订单ID
const orderId = ref<string>()
// 提交
const onSubmite = async () => {
  if (!orderData.value?.goods?.length) {
    uni.showToast({ icon: 'none', title: '订单信息加载中，请稍后' })
    return
  }
  if (addressStore.addressSelectedItem) {
    const res = await submiteOrderAPI({
      goods: orderData.value.goods.map((item) => {
        return {
          count: item.count,
          skuId: item.skuId,
        }
      }),
      addressId: addressStore.addressSelectedItem.id,
      deliveryTimeType: pickerParams.value,
      buyerMessage: inputValue.value,
      payType: 1,
      payChannel: 1,
    })
    console.log(res)
    orderId.value = res.result.id
    uni.navigateTo({ url: `/pagesOrder/orderDetail/orderDetail?id=${orderId.value}` })
  } else {
    uni.showToast({ icon: 'none', title: '请选择收货地址' })
  }
}
// 接收参数（立即购买传递过来的）
const query = defineProps<{ skuId: string; count: string }>()
onLoad(() => {
  getOrderPre()
})
</script>

<template>
  <view class="writeOrder">
    <navigator url="/pagesMember/manageAdress/manageAdress">
      <view class="top card">
        <view class="left">
          <image src="../../static/images/locate.png" mode="scaleToFill" />
          <view class="text">{{ addressParams }}</view>
        </view>
        <view class="right">
          <uni-icons type="right" size="26" color="#ccc"></uni-icons>
        </view>
      </view>
    </navigator>
    <view class="center card">
      <view v-if="orderData?.goods.length === 0">商品是无效商品，再去逛逛吧~</view>
      <view class="item" v-for="item in orderData?.goods" :key="item.skuId">
        <view class="left">
          <image :src="item.picture" mode="aspectFill" />
        </view>
        <view class="right">
          <view class="title">{{ item.name }}</view>
          <view class="style">{{ item.attrsText }}</view>
          <view class="bottom">
            <view class="price">￥{{ item.totalPayPrice }}</view>
            <view class="oldPrice">{{ item.totalPrice }}</view>
          </view>
        </view>
        <view class="count">x {{ item.count }}</view>
      </view>
    </view>
    <view class="params card">
      <view class="time">
        <view>配送时间</view>
        <picker @change="pickerChange" mode="selector" :range="range" :value="pickerValue">
          <view class="right">
            <view class="text"> {{ pickerValue || '时间不限(周一至周日)' }}</view>
            <uni-icons type="right" size="26" color="#ccc"></uni-icons>
          </view>
        </picker>
      </view>
      <view class="write">
        <view>订单备注</view>
        <view class="right">
          <input type="text" v-model="inputValue" placeholder="建议留言前先与商家沟通确认" />
        </view>
      </view>
    </view>
    <view class="data card">
      <view class="item">
        <view>商品总价:</view>
        <view>￥{{ (orderData?.summary.totalPrice ?? 0).toFixed(2) }}</view>
      </view>
      <view class="item">
        <view>运费:</view>
        <view>￥{{ (orderData?.summary.postFee ?? 0).toFixed(2) }}</view>
      </view>
    </view>
    <view class="btn" :style="{ 'padding-bottom': finalPaddingBottom }">
      <view class="left">￥{{ (orderData?.summary.totalPayPrice ?? 0).toFixed(2) }}</view>
      <view @click="onSubmite" class="right">提交订单</view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
page {
  height: 100%;
}
.writeOrder {
  /* #ifdef H5 */
  height: 100%;
  /* #endif */
  /* #ifndef H5 */
  height: 100vh;
  /* #endif */
  overflow: auto;
  background-color: #eee;
  padding-bottom: 300rpx;
  .card {
    background-color: #fff;
    padding: 10rpx;
    width: 95vw;
    margin: 20rpx auto;
    border-radius: 10rpx;
  }
  .top {
    padding: 20rpx 0 20rpx 10rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      image {
        margin: 0 10rpx;
        width: 50rpx;
        height: 50rpx;
      }
      .text {
        color: $text-color-1;
        font-size: 27rpx;
        width: 570rpx;
      }
    }
  }
  .center {
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
  }
  .params {
    .time {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10rpx 5rpx;
      .right {
        display: flex;
        align-items: center;
        .text {
          color: $text-color-2;
        }
      }
    }
    .write {
      display: flex;
      justify-content: space-between;
      padding: 15rpx 5rpx;
    }
  }
  .data {
    .item {
      display: flex;
      justify-content: space-between;
      padding: 10rpx;
    }
  }
  .btn {
    position: fixed;
    z-index: 101;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 30rpx 20rpx;
    background-color: #fff;
    .left {
      font-size: 33rpx;
      width: 510rpx;
      color: #b30808;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    .right {
      padding: 15rpx 35rpx;
      background-color: $theme-color;
      color: #fff;
      border-radius: 50rpx;
    }
  }
}
</style>
