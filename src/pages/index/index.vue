<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '@/pages/index/components/NavBar.vue'
import XtxBanner from '../components/XtxBanner.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import XtxGuess from '../components/XtxGuess.vue'
import SkeletonPage from './components/SkeletonPage.vue'
import type { XtxGuessInstance } from '../types/components'
import type { BannerList, CategoryList, HotList } from '../types/home'
import { getBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/service/home'
import { onLoad } from '@dcloudio/uni-app'
const XtxGuessRef = ref<XtxGuessInstance>()

// 组件请求数据
// 轮播图
const bannerList = ref<BannerList[]>([])
const getBannerList = async () => {
  const res = await getBannerAPI()
  bannerList.value = res.result
  console.log(res)
}
// 分类
const categoryList = ref<CategoryList[]>([])
const getCategoryList = async () => {
  const res = await getHomeCategoryAPI()
  categoryList.value = res.result
}
// 热门
const hotList = ref<HotList[]>([])
const getHotList = async () => {
  const res = await getHomeHotAPI()
  hotList.value = res.result
}

// 触底 - 调用子组件猜你喜欢的方法
const onScrollBottom = () => {
  console.log(111)

  XtxGuessRef.value?.getGuessList()
}

// 下拉刷新
const isTrigger = ref(false) // 是否在刷新？
const onRefresh = async () => {
  isTrigger.value = true
  XtxGuessRef.value?.resetData() //重置猜你喜欢数据状态
  await Promise.allSettled([
    XtxGuessRef.value?.getGuessList(),
    getBannerList(),
    getCategoryList(),
    getHotList(),
  ])
  isTrigger.value = false
}

const isLoading = ref(false)
onLoad(async () => {
  isLoading.value = true
  await Promise.all([getBannerList(), getCategoryList(), getHotList()])
  isLoading.value = false
})
</script>

<template>
  <view class="body">
    <!-- 自定义头部 -->
    <NavBar></NavBar>
    <scroll-view
      @scrolltolower="onScrollBottom"
      refresher-enabled
      :refresher-triggered="isTrigger"
      @refresherrefresh="onRefresh"
      scroll-y
      class="scroll"
    >
      <!-- 骨架屏 -->
      <SkeletonPage v-if="isLoading"></SkeletonPage>

      <template v-else>
        <!-- 轮播图 -->
        <XtxBanner :list="bannerList"></XtxBanner>
        <!-- 分类 -->
        <CategoryPanel :list="categoryList"></CategoryPanel>
        <!-- 热门 -->
        <HotPanel :list="hotList"></HotPanel>
        <!-- 猜你喜欢 -->
        <XtxGuess ref="XtxGuessRef"></XtxGuess>
      </template>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
// h5导航栏是dom元素（建立在body里面page外面），占用空间，100%是继承剩余的空间

.body {
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;
  height: 100vh;
  overflow: hidden;
  .scroll {
    flex: 1;
    overflow: auto;
  }
}
</style>
