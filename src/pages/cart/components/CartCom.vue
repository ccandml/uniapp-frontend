<script setup lang="ts">
import XtxGuess from '@/components/XtxGuess.vue'
import { addCartCountAPI, delCartAPI, getCartAPI, selectedAllCartAPI } from '@/service/cart'
import { useMemberStore } from '@/stores'
import type { CartItem } from '@/types/cart'
import type { XtxGuessInstance } from '@/types/components'
import type { InputNumberBoxEvent } from '@/types/vk-data-input-number-box'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'

const memberStore = useMemberStore()
// 登陆状态
const isLogin = computed(() => {
  return memberStore.profile?.access_token
})
// 渲染购物车
const cartList = ref<CartItem[]>()
const getCartData = async () => {
  const res = await getCartAPI()
  console.log(res)
  cartList.value = res.result
}
// 修改单品数量
const onChangeCount = async (e: InputNumberBoxEvent, item: CartItem) => {
  if (e.value <= item.stock) {
    const res = await addCartCountAPI(item.cartId, { selected: item.selected, count: e.value })
    console.log(res)
    getCartData()
  } else {
    uni.showToast({ icon: 'none', title: `库存紧张~` })
  }
}
// 全选和单选
const isAll = computed(() => {
  return cartList.value?.every((item) => item.selected)
})
const onCheckChange = async (e: UniHelper.CheckboxGroupOnChangeEvent, item: CartItem) => {
  const selected = e.detail.value.includes(item.cartId)
  // 部分端在列表渲染后会触发 change，这里避免与当前状态一致时重复请求
  if (selected === item.selected) {
    return
  }
  item.selected = selected
  const res = await addCartCountAPI(item.cartId, { selected: item.selected, count: item.count })
  console.log(res)
}
const onChangeAll = async () => {
  let selectedAll = !isAll.value
  console.log(!isAll.value)
  const res = await selectedAllCartAPI(!isAll.value)
  console.log(res)
  // 重新渲染购物车
  console.log(selectedAll)
  cartList.value!.forEach((item) => {
    item.selected = selectedAll
  })
}
// 总价格
const allPrice = computed(() => {
  return cartList.value
    ?.filter((item) => item.selected)
    .reduce((sum, i) => {
      return sum + i.nowPrice * i.count
    }, 0)
    .toFixed(2)
})
// 总数量
const allCount = computed(() => {
  return cartList.value?.filter((item) => item.selected).reduce((sum, i) => sum + i.count, 0)
})
// 滑动删除
const options = ref<UniHelper.UniSwipeActionItemOption[]>([
  {
    text: '取消',
    style: {
      backgroundColor: '#22a6f1',
      color: '#fff',
      fontSize: '25rpx',
    },
  },
  {
    text: '删除',
    style: {
      backgroundColor: '#27ba9b',
      color: '#fff',
      fontSize: '25rpx',
    },
  },
])
const swipeActionRef = ref<UniHelper.UniSwipeActionInstance>()
const onDel = (e: UniHelper.UniSwipeActionItemOnClickEvent, cartId: string) => {
  console.log(e)

  if (e.index === 1) {
    uni.showModal({
      title: '确定要删除吗？',
      success: async (success) => {
        if (success.confirm) {
          const res = await delCartAPI(cartId)
          console.log(res)
          // 重新渲染购物车
          getCartData()
        }
      },
    })
  } else {
    swipeActionRef.value!.closeAll!()
  }
}
// 结算订单
const goPay = () => {
  if (allCount.value! > 0) {
    uni.navigateTo({ url: '/pagesOrder/writeOrder/writeOrder' })
  } else {
    uni.showToast({ icon: 'none', title: '请选择商品结算' })
  }
}

const goGoodsDetail = (item: CartItem) => {
  uni.navigateTo({ url: `/pages/goodsDetail/goodsDetail?id=${item.productId}` })
}
// 触底加载
const XtxGuessRef = ref<XtxGuessInstance>()
const onScrolltolower = () => {
  XtxGuessRef.value?.getGuessList()
}
onShow(() => {
  if (isLogin.value) {
    getCartData()
  }
})
</script>

<template>
  <view class="cart">
    <scroll-view class="scroll" scroll-y @scrolltolower="onScrolltolower">
      <view class="login" v-if="isLogin">
        <view class="haveCount" v-if="cartList?.length">
          <view class="top">
            <view class="left">满减</view>
            <view class="right">满1件，即可享受9折优惠</view>
          </view>
          <uni-swipe-action ref="swipeActionRef">
            <uni-swipe-action-item
              @click="(e) => onDel(e, item.cartId)"
              :right-options="options"
              v-for="item in cartList"
              :key="item.cartId"
            >
              <view class="item">
                <view class="left">
                  <checkbox-group @change="(e) => onCheckChange(e, item)">
                    <checkbox
                      :value="item.cartId"
                      :checked="item.selected"
                      activeBackgroundColor="#27ba9b"
                      iconColor="#fff"
                    ></checkbox>
                  </checkbox-group>
                </view>
                <view class="center">
                  <image :src="item.picture" mode="aspectFill" @click="goGoodsDetail(item)" />
                </view>
                <view class="right" @click="goGoodsDetail(item)">
                  <view class="title">{{ item.name }}</view>
                  <view class="style">{{ item.attrsText }}</view>
                  <view class="price">{{ item.nowPrice }}</view>
                </view>
                <view class="input">
                  <vk-data-input-number-box
                    :min="1"
                    :max="item.stock"
                    :modelValue="item.count"
                    :index="item.cartId"
                    @change="(e: InputNumberBoxEvent) => onChangeCount(e, item)"
                  ></vk-data-input-number-box>
                </view>
              </view>
            </uni-swipe-action-item>
          </uni-swipe-action>
        </view>
        <view class="noCount" v-else>
          <image src="../../../static/images/blank_cart.png" mode="aspectFill" />
          <view class="text">空空如也~</view>
          <navigator url="/pages/index/index" open-type="reLaunch"
            ><view class="btn">去逛逛</view>
          </navigator>
        </view>
      </view>
      <view class="nologin" v-else>
        <view class="box">
          <view class="title">登录后查看购物车</view>
          <navigator url="/pages/login/login" class="btn">去登陆</navigator>
        </view>
      </view>
      <view class="buy" v-if="isLogin">
        <view class="content">
          <view class="left">
            <checkbox-group @change="onChangeAll">
              <checkbox
                :checked="isAll"
                activeBackgroundColor="#27ba9b"
                iconColor="#fff"
              ></checkbox>
            </checkbox-group>
            <view>全选</view>
          </view>
          <view class="center">
            <view class="left">合计:</view>
            <view class="price">{{ allPrice }}</view>
          </view>
          <view @click="goPay" class="right" :class="{ disabled: allCount! > 0 ? false : true }">
            去结算({{ allCount! > 99 ? '99+' : allCount }})
          </view>
        </view>
      </view>
      <XtxGuess ref="XtxGuessRef"></XtxGuess>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
page {
  height: 100%;
}
.cart {
  height: 100%;
  padding: 0 20rpx;
  padding-bottom: 110rpx;
  background-color: #f9f9f9;
  .scroll {
    overflow: auto;
    height: calc(100vh - var(--window-top) - var(--window-bottom));

    .login {
      .haveCount {
        :deep(.button-group--right) {
          overflow: hidden;
          padding-left: 20rpx;
          height: 210rpx;
          margin: auto 0;
          .uni-swipe_button {
            &:nth-child(1) {
              border-radius: 20rpx 0 0 20rpx;
            }
            &:nth-child(2) {
              border-radius: 0 20rpx 20rpx 0;
            }
          }
        }

        .top {
          padding: 20rpx 0;
          display: flex;
          .left {
            padding: 0 20rpx;
            background-color: $theme-color;
            margin-right: 10rpx;
            color: #fff;
            border-radius: 5rpx;
          }
          .right {
            color: $text-color-1;
          }
        }
        .item {
          margin: 20rpx auto;
          border-radius: 20rpx;
          padding: 30rpx 10rpx;
          background-color: #fff;
          display: flex;
          align-items: center;
          position: relative;
          .center {
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
            .price {
              color: rgb(179, 8, 8);
              padding-left: 15rpx;
            }
          }
          .input {
            position: absolute;
            bottom: 20rpx;
            right: 20rpx;
          }
        }
      }
      .noCount {
        width: fit-content;
        margin: 30rpx auto;
        text-align: center;
        image {
          width: 300rpx;
          height: 300rpx;
        }
        .text {
          color: $text-color-2;
        }
        .btn {
          background-color: $theme-color;
          color: #fff;
          padding: 10rpx 20rpx;
          border-radius: 50rpx;
          width: 250rpx;
          margin: 30rpx auto;
          margin-bottom: 100rpx;
        }
      }
    }
    .nologin {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 50rpx 0;
      .title {
        padding: 20rpx 0;
      }
      .btn {
        background-color: $theme-color;
        border-radius: 50rpx;
        padding: 15rpx;
        margin: 50rpx 0;
        width: 300rpx;
        color: #fff;
      }
    }
    .buy {
      position: fixed;
      bottom: var(--window-bottom);
      z-index: 100;
      width: 100vw;
      left: 0;
      background-color: #fff;
      padding: 20rpx 0;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
      .disabled {
        background-color: rgba(39, 186, 155, 0.3) !important;
      }
      .content {
        width: 100%;
        display: flex;
        align-items: center;
        .left {
          flex-shrink: 0;
          padding: 0 20rpx;
          display: flex;
          align-items: center;
          font-size: 27rpx;
          color: $text-color-1;
        }
        .center {
          display: flex;
          align-items: center;
          flex: 1;
          .left {
            flex-shrink: 0;
          }
          .price {
            padding-left: 10rpx;
            color: rgb(179, 8, 8);
            font-size: 35rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 250rpx;
          }
        }
        .right {
          background-color: $theme-color;
          color: #fff;
          padding: 20rpx 40rpx;
          margin-right: 20rpx;
          border-radius: 50rpx;
        }
      }
    }
  }
}
</style>
