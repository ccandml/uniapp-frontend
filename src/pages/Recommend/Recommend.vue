<script lang="ts" setup>
import { ref } from 'vue'
import { getHotDetailAPI } from '@/service/hot'
import type { HotPanelData, HotRquest } from '../../types/hot'
import { onLoad } from '@dcloudio/uni-app'
import type { GoodsItems, PagesResult } from '../../types/global'

// 四个不同请求
const query = ref<HotRquest>({
  page: 1,
  pageSize: 10,
  type: '',
})
const activeIndex = ref<number>(0)
const detailList = ref<HotPanelData>()
// 选择展示的数据
const subTypesList = ref<
  {
    id: string
    title: string
    goodsItems: PagesResult<GoodsItems[]>
    isFinish?: boolean
  }[]
>()
// 请求数据
const getHotData = async () => {
  try {
    const res = await getHotDetailAPI(query.value)
    console.log(res)
    detailList.value = res.result
    subTypesList.value = (res.result.subTypes || []).map((item) => ({
      ...item,
      isFinish: item.goodsItems.page >= item.goodsItems.pages,
    }))
    // navbar
    uni.setNavigationBarTitle({ title: detailList.value.title || '特惠推荐' })
  } catch (error) {
    console.error('getHotData error:', error)
    uni.showToast({ icon: 'none', title: '数据加载失败' })
  }
}

// 触底加载
const onScrolltolower = async () => {
  if (!subTypesList.value?.length) return

  const hasMore = subTypesList.value.some((item) => item.goodsItems.page < item.goodsItems.pages)

  if (!hasMore) {
    subTypesList.value = subTypesList.value.map((item) => ({
      ...item,
      isFinish: true,
    }))
    return uni.showToast({ icon: 'none', title: '已经到底了~' })
  }

  // 后端每次都会返回所有 subTypes 的同一页数据，这里统一翻页并合并
  try {
    query.value.page++
    const res = await getHotDetailAPI(query.value)
    console.log(res)

    const nextSubTypes = res.result.subTypes || []
    subTypesList.value = subTypesList.value.map((item, index) => {
      const nextItem = nextSubTypes[index]
      if (!nextItem) return item

      return {
        ...item,
        goodsItems: {
          ...item.goodsItems,
          page: nextItem.goodsItems.page,
          pages: nextItem.goodsItems.pages,
          items: [...item.goodsItems.items, ...nextItem.goodsItems.items],
        },
        isFinish: nextItem.goodsItems.page >= nextItem.goodsItems.pages,
      }
    })
  } catch (error) {
    // 回滚页码，避免下一次请求跳页
    query.value.page = Math.max(1, query.value.page - 1)
    console.error('onScrolltolower error:', error)
    uni.showToast({ icon: 'none', title: '加载失败，请重试' })
  }
}

onLoad((options) => {
  query.value.type = (options?.type as string) || ''
  getHotData()
})
// 点击事件
</script>

<template>
  <view class="Recommend">
    <view class="top">
      <image :src="detailList?.bannerPicture" mode="aspectFill" />
      <view class="fix">
        <view
          @click="activeIndex = index"
          v-for="(item, index) in detailList?.subTypes"
          :key="item.id"
          class="item"
          :class="{ active: activeIndex === index }"
          >{{ item.title }}</view
        >
      </view>
    </view>
    <!-- 组件 -->
    <scroll-view
      v-for="(item, index) in subTypesList"
      :key="item.id"
      v-show="activeIndex === index"
      class="scroll"
      @scrolltolower="onScrolltolower"
      scroll-y
    >
      <view class="box"></view>
      <view class="content">
        <navigator
          class="navigator"
          v-for="goods in item.goodsItems.items"
          :key="goods.id"
          :url="`/pages/goodsDetail/goodsDetail?id=${goods.id}`"
          open-type="navigate"
          hover-class="navigator-hover"
        >
          <view class="item">
            <image :src="goods.picture" mode="aspectFill" />
            <view class="bottom">
              <view class="text">{{ goods.name }}</view>
              <view class="monney">￥{{ goods.price }}</view>
            </view>
          </view>
        </navigator>
      </view>
      <!-- 加载中。。。 -->
      <view v-if="!item.isFinish" class="loading">
        <uni-icons type="spinner-cycle" size="25"></uni-icons>
        加载中...
      </view>
      <view v-else class="loading"> 已经到底了~ </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
page {
  height: 100%;
}
.Recommend {
  background-color: #eee;
  display: flex;
  flex-direction: column;
  /* #ifdef H5 */
  height: 100%;
  /* #endif */
  /* #ifndef H5 */
  height: 100vh;
  /* #endif */
  overflow: hidden;
  .scroll {
    flex: 1;
    overflow: auto;
    .box {
      height: 50rpx;
    }
    .content {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15rpx;
      width: 95vw;
      margin: 0 auto;

      .navigator {
        background-color: #fff;
        border-radius: 15rpx;
        padding: 20rpx;
        .item {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          image {
            width: 310rpx;
            height: 310rpx;
            display: block;
            border-radius: 15rpx;
          }
          .bottom {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .text {
            }
            .monney {
              color: rgb(212, 55, 55);
            }
          }
        }
      }
    }
    .loading {
      color: $text-color-2;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 45rpx;
    }
  }
  .top {
    image {
      width: 100%;
      height: 200rpx;
      border-radius: 0 0 40rpx 40rpx;
    }
    .fix {
      z-index: 100;
      position: absolute;
      width: 96vw;
      height: 95rpx;
      left: 0;
      right: 0;
      margin: 0 auto;
      top: 140rpx;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background-color: #fff;
      border-radius: 20rpx;
      .item {
      }
      .active {
        position: relative;
        &::after {
          position: absolute;
          content: '';
          bottom: -8rpx;
          left: 50%;
          transform: translateX(-50%);
          height: 4rpx;
          width: 40rpx;
          background-color: $theme-color;
        }
      }
    }
  }
}
</style>
