<script lang="ts" setup>
import { ref } from 'vue'
import { getHotDetailAPI } from '@/service/hot'
import type { HotPanelData, HotRquest } from '../types/hot'
import { onLoad } from '@dcloudio/uni-app'
import type { GoodsItems, PagesResult } from '../types/global'
// 四个请求
const MapRequestData = [
  { type: '1', url: '/hot/preference' },
  { type: '2', url: '/hot/inVogue' },
  { type: '3', url: '/hot/oneStop' },
  { type: '4', url: '/hot/new' },
]
const query = ref<HotRquest>({
  page: 1,
  pageSize: 10,
})
const activeIndex = ref<number>(0)
const props = defineProps<{ type: string }>()
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
  const res = await getHotDetailAPI(
    MapRequestData.find((item) => item.type === props.type)!.url,
    query.value,
  )
  console.log(res)
  detailList.value = res.result
  subTypesList.value = res.result.subTypes
  // navbar
  uni.setNavigationBarTitle({ title: detailList.value.title })
}

// 触底加载
const onScrolltolower = async () => {
  if (
    subTypesList.value![activeIndex.value]!.goodsItems.page <
    subTypesList.value![activeIndex.value]!.goodsItems.pages
  ) {
    subTypesList.value![activeIndex.value]!.goodsItems.page++
  } else {
    subTypesList.value![activeIndex.value]!.isFinish = true
    return uni.showToast({ icon: 'none', title: '已经到底了~' })
  }
  // console.log(subTypesList.value![activeIndex.value]?.id)
  // 发送当前tab的id的请求
  const res = await getHotDetailAPI(MapRequestData.find((item) => item.type === props.type)!.url, {
    page: subTypesList.value![activeIndex.value]!.goodsItems.page,
    pageSize: subTypesList.value![activeIndex.value]!.goodsItems.pageSize,
    subType: subTypesList.value![activeIndex.value]!.id,
  })
  console.log(res)
  subTypesList.value![activeIndex.value]!.goodsItems.items.push(
    ...res.result.subTypes[activeIndex.value]!.goodsItems.items,
  )
}

onLoad(() => {
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
          v-for="item in subTypesList![activeIndex]?.goodsItems.items"
          :key="item.id"
          url="/pages/"
          open-type="navigate"
          hover-class="navigator-hover"
        >
          <view class="item">
            <image :src="item.picture" mode="aspectFill" />
            <view class="bottom">
              <view class="text">{{ item.name }}</view>
              <view class="monney">￥{{ item.price }}</view>
            </view>
          </view>
        </navigator>
      </view>
      <!-- 加载中。。。 -->
      <view v-if="!subTypesList?.[activeIndex]!.isFinish" class="loading">
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
