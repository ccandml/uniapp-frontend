<script setup lang="ts">
import { ref } from 'vue'
import type { PagesRequest } from '@/types/global'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { getSearchListAPI } from '@/service/search'
import { useHistoryStore } from '@/stores'
import type { SearchList } from '@/types/search'

// 获取搜索关键词
const historyStore = useHistoryStore()
const keyword = ref('')

// 分页参数
const data = ref<PagesRequest>({
  page: 1,
  pageSize: 10,
})

// 请求状态
const isFinish = ref(false)
const searchList = ref<SearchList[]>([])

/** 获取搜索列表数据 */
const getSearchList = async () => {
  // 停止请求
  if (isFinish.value) {
    return
  }
  const res = await getSearchListAPI({
    page: data.value.page,
    pageSize: data.value.pageSize,
    keyword: keyword.value,
  })

  searchList.value = [...searchList.value, ...res.result.items]
  data.value.page++

  // 到底了
  if (res.result.items.length < data.value.pageSize) {
    isFinish.value = true
  }
}

onLoad(async () => {
  // 从搜索历史中获取最后一个搜索关键词
  keyword.value = historyStore.history[0] || ''
  if (keyword.value) {
    await getSearchList()
  }
})

// 上拉加载更多
onReachBottom(() => {
  getSearchList()
})
</script>

<template>
  <view class="search-detail">
    <!-- 搜索关键词标题 -->
    <view class="top">
      <view class="title">搜索结果：{{ keyword }}</view>
    </view>
    <!-- 商品列表 -->
    <view class="content">
      <navigator
        class="navigator"
        v-for="item in searchList"
        :key="item.id"
        :url="`/pages/goodsDetail/goodsDetail?id=${item.id}`"
        open-type="navigate"
        hover-class="navigator-hover"
      >
        <view class="goods-card">
          <image :src="item.picture" mode="aspectFill" />
          <view class="text">
            <view class="name">{{ item.name }}</view>
            <view class="price">￥{{ item.price }}</view>
          </view>
        </view>
      </navigator>
    </view>
    <!-- 加载中状态 -->
    <view v-if="!isFinish && searchList.length > 0" class="loading">
      <uni-icons type="spinner-cycle" size="25"></uni-icons>
      加载中...
    </view>
    <!-- 没有数据 -->
    <view v-else-if="searchList.length === 0" class="empty"> 未找到相关商品 </view>
    <!-- 到底提示 -->
    <view v-else class="loading">已经到底了~</view>
  </view>
</template>

<style scoped lang="scss">
.search-detail {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;

  .top {
    background-color: #fff;
    padding: 30rpx;
    border-bottom: 1rpx solid #eee;
    border-radius: 15rpx;
    .title {
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15rpx;
    padding: 20rpx;

    .navigator {
      background-color: #fff;
      border-radius: 15rpx;
      padding: 20rpx;
      overflow: hidden;

      .goods-card {
        height: 100%;
        display: flex;
        flex-direction: column;

        image {
          width: 100%;
          height: 310rpx;
          display: block;
          border-radius: 15rpx;
          margin-bottom: 15rpx;
        }

        .text {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .name {
            font-size: 26rpx;
            color: #333;
            line-height: 1.5;
            word-break: break-word;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }

          .price {
            font-size: 30rpx;
            color: rgb(212, 55, 55);
            font-weight: 600;
            margin-top: 10rpx;
          }
        }
      }
    }
  }

  .loading {
    color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 45rpx;
    gap: 15rpx;
  }

  .empty {
    text-align: center;
    padding: 100rpx 30rpx;
    color: #999;
    font-size: 28rpx;
  }
}
</style>
