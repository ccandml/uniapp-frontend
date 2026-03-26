<script lang="ts" setup>
import XtxGuess from '@/components/XtxGuess.vue'
import { useMemberStore } from '@/stores'
import { ref } from 'vue'

const orderType = [
  { type: '1', typeName: '待付款', icon: 'wallet' },
  { type: '2', typeName: '待发货', icon: 'paperplane' },
  { type: '3', typeName: '待收货', icon: 'gift' },
  { type: '4', typeName: '待评价', icon: 'chat' },
  { type: '0', typeName: '售后', icon: 'headphones' },
]

const memberStore = useMemberStore()

// 触底加载
const XtxGuessRef = ref()
const onScroll = () => {
  XtxGuessRef.value.getGuessList()
}
// 登录
const goLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login',
  })
}
// 修改信息
const goChangeInfo = () => {
  uni.navigateTo({
    url: '/pagesMember/userInfo/userInfo',
  })
}
// 安全区
const SystemInfo = uni.getSystemInfoSync()
console.log(SystemInfo.safeAreaInsets?.top)
</script>

<template>
  <view class="user">
    <view class="navBar">
      <image src="../../static/images//center_bg.png" mode="widthFix" />
      <view class="info">
        <!-- 安全区 -->
        <!-- #ifndef H5 -->
        <view class="top" :style="{ height: SystemInfo.safeAreaInsets?.top + 'px' }"></view>
        <!-- #endif -->
        <view class="content" v-if="!memberStore.profile" @click="goLogin">
          <view class="avator">
            <image src="../../static/xxmLogo.png" mode="aspectFill" />
          </view>
          <view class="right">
            <navigator class="name">未登录</navigator>
            <navigator>
              <view class="change">点我去登录</view>
            </navigator>
          </view>
        </view>

        <view class="content" @click="goChangeInfo" v-else>
          <view class="avator">
            <image :src="memberStore.profile!.avatar" mode="aspectFill" />
          </view>
          <view class="right">
            <view class="name">{{ memberStore.profile.username }}</view>
            <navigator>
              <view class="change">修改昵称和头像</view>
            </navigator>
          </view>
        </view>
      </view>

      <navigator url="/pagesMember/setting/setting" class="setting"> 设置 </navigator>
      <!-- 订单 -->
      <view class="order">
        <navigator url="/pagesOrder/orderClassify/orderClassify">
          <view class="all">
            <view>全部订单</view>
            <uni-icons type="right" size="25" color="#ccc"></uni-icons>
          </view>
        </navigator>
        <!-- 分类订单 -->
        <view class="orderType">
          <navigator
            v-for="item in orderType"
            :key="item.type"
            :url="`/pagesOrder/orderClassify/orderClassify?type=${item.type}`"
          >
            <view class="content">
              <uni-icons :type="item.icon as any" size="30"></uni-icons>
              <view class="text">{{ item.typeName }}</view>
            </view>
          </navigator>
        </view>
      </view>
    </view>
    <!-- 猜你喜欢 -->
    <scroll-view @scrolltolower="onScroll" class="scroll" scroll-y>
      <view class="top"></view>
      <XtxGuess ref="XtxGuessRef"></XtxGuess>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
page {
  height: 100%;
}
.user {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #eee;
  /* #ifdef H5 */
  height: 100%;
  /* #endif */
  /* #ifndef H5 */
  height: 100vh;
  /* #endif */
  .navBar {
    position: relative;
    image {
      width: 100%;
    }
    .info {
      position: absolute;
      /* #ifdef H5 */
      top: 90rpx;
      /* #endif */
      /* #ifndef H5 */
      top: 20rpx;

      /* #endif */
      left: 50rpx;
      .content {
        display: flex;
        .avator {
          width: 130rpx;
          height: 130rpx;
          border-radius: 50%;
          overflow: hidden;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .right {
          margin-left: 20rpx;
          .name {
            color: #fff;
            font-size: 35rpx;
          }
          .change {
            margin-top: 30rpx;
            padding: 5rpx 15rpx;
            align-items: center;
            font-size: 20rpx;
            border: 1px solid #eee;
            color: #eee;
            border-radius: 30rpx;
            width: fit-content;
          }
        }
      }
    }
    .setting {
      position: absolute;
      right: 40rpx;
      top: 200rpx;
      color: #eee;
      font-size: 28rpx;
    }
    .order {
      z-index: 100;
      position: absolute;
      width: 95vw;
      background-color: #fff;
      right: 0;
      left: 0;
      top: 270rpx;
      margin: 0 auto;
      border-radius: 20rpx;
      padding-bottom: 20rpx;
      .all {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10rpx;
        padding-left: 25rpx;
        border-bottom: 1rpx solid #eee;
        font-size: 25rpx;
      }

      .orderType {
        margin-top: 10rpx;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 10rpx 0;
        .content {
          display: flex;
          height: 100%;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          :deep(.uni-icons) {
            color: orange !important;
          }
          .text {
            font-size: 25rpx;
          }
        }
      }
    }
  }

  .scroll {
    flex: 1;
    overflow: auto;
    .top {
      height: 35rpx;
    }
  }
}
</style>
