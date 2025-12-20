<script lang="ts" setup>
import { useMemberStore } from '@/stores'

const memberStore = useMemberStore()
const logout = () => {
  uni.showModal({
    title: '确定要退出登录吗？',
    confirmColor: '#48c6b0',
    success: (success) => {
      if (success.confirm) {
        memberStore.clearProfile()
        uni.navigateBack()
      }
    },
  })
}
</script>

<template>
  <view class="setting">
    <view class="card" v-if="memberStore.profile">
      <navigator url="/pagesMember/manageAdress/manageAdress">
        <view class="item">
          <view class="left">地址管理</view>
          <uni-icons type="right" size="25"></uni-icons>
        </view>
      </navigator>
    </view>
    <view class="card">
      <view class="item">
        <view class="left">授权管理</view>
        <uni-icons type="right" size="25"></uni-icons>
      </view>
      <view class="item">
        <view class="left">问题反馈</view>
        <uni-icons type="right" size="25"></uni-icons>
      </view>
      <view class="item">
        <view class="left">联系我们</view>
        <uni-icons type="right" size="25"></uni-icons>
      </view>
    </view>
    <view class="card">
      <view class="item">
        <view class="left">关于小兔鲜儿</view>
        <uni-icons type="right" size="25"></uni-icons>
      </view>
    </view>
    <view v-if="memberStore.profile" @click="logout" class="btn">退出登录</view>
  </view>
</template>

<style lang="scss" scoped>
page {
  height: 100%;
}
.setting {
  overflow: hidden;
  background-color: #eee;
  /* #ifdef H5 */
  height: 100%;
  /* #endif */
  /* #ifndef H5 */
  height: 100vh;
  /* #endif */
  .card {
    width: 95vw;
    background-color: #fff;
    margin: 30rpx auto;
    padding: 4rpx 20rpx;
    border-radius: 20rpx;
    .item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
      padding: 20rpx;
      &:last-child {
        border: none;
      }
      :deep(.uni-icons) {
        color: #ccc !important;
      }
    }
  }
  .btn {
    width: 40vw;
    background-color: #fff;
    margin: 50rpx auto;
    padding: 20rpx;
    text-align: center;
    border-radius: 50rpx;
    color: #bbb;
  }
}
</style>
