<script lang="ts" setup>
import { useHistoryStore } from '@/stores'
import { onBackPress } from '@dcloudio/uni-app'
import { ref } from 'vue'
const historyStore = useHistoryStore()
const searchInput = ref()
// 点击搜索
const onSearch = () => {
  if (!searchInput.value.trim()) {
    return (searchInput.value = '')
  }
  historyStore.setHistory(searchInput.value)
  uni.navigateTo({ url: '/pages/search/searchDetail/searchDetail' })
  searchInput.value = ''
}
// 点击历史记录搜索
const goSearch = (e: any) => {
  historyStore.setHistory(e)
  uni.navigateTo({ url: '/pages/search/searchDetail/searchDetail' })
}
// 清空记录
const delHistory = () => {
  uni.showModal({
    title: '清空历史纪录?',
    success(result) {
      if (result.confirm) {
        historyStore.clearHistory()
      }
    },
  })
}
// 返回首页
onBackPress((options) => {
  if (options.from === 'backbutton') {
    uni.reLaunch({ url: '/pages/index/index' })
  }
})
</script>

<template>
  <view class="search">
    <view class="top">
      <uni-search-bar v-model="searchInput" @confirm="onSearch" radius="20" :focus="true">
      </uni-search-bar>
    </view>
    <view class="box"></view>
    <view class="history" v-if="historyStore.history.length">
      <view class="title">
        <view class="left">搜索历史</view>
        <view class="right" @click="delHistory">
          <uni-icons type="trash" size="25" color="#ccc"></uni-icons>
        </view>
      </view>
      <view class="content">
        <view
          class="item"
          v-for="item in historyStore.history"
          :key="item"
          @click="goSearch(item)"
          >{{ item }}</view
        >
      </view>
    </view>
    <view class="history">
      <view class="title">
        <view class="left">搜索发现</view>
      </view>
      <view class="content">
        <view class="item" @click="goSearch('脑白金')">脑白金</view>
        <view class="item" @click="goSearch('鼠标')">鼠标</view>
        <view class="item" @click="goSearch('橘子')">橘子</view>
        <view class="item" @click="goSearch('苹果')">苹果</view>
        <view class="item" @click="goSearch('葡萄')">葡萄</view>
        <view class="item" @click="goSearch('香蕉')">香蕉</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.search {
  .top {
    :deep(.uni-searchbar__box) {
      height: 80rpx;
    }
    position: fixed;
    background-color: #fff;
    width: 100%;
    z-index: 100;
  }
  .box {
    height: 110rpx;
  }
  .history {
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 30rpx 0;
      .left {
        color: $text-color-1;
      }
    }
    .content {
      padding: 20rpx;
      display: flex;
      flex-wrap: wrap;
      .item {
        flex-shrink: 0;
        padding: 5rpx 20rpx;
        margin: 0 10rpx 20rpx;
        border-radius: 20rpx;
        color: $text-color-1;
        background-color: #f8f8f8;
      }
    }
  }
}
</style>
