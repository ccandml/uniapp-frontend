<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '@/pages/index/components/NavBar.vue'
import XtxBanner from '@/components/XtxBanner.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import XtxGuess from '@/components/XtxGuess.vue'
import BackTop from '@/components/BackTop.vue'
import SystemNoticePopup from '@/components/SystemNoticePopup.vue'
import SkeletonPage from './components/SkeletonPage.vue'
import type { XtxGuessInstance } from '../../types/components'
import type { BannerList, CategoryList, HotList } from '../../types/home'
import { getBannerAPI, getHomeCategoryAPI, getHomeHotAPI, getNoticeAPI } from '@/service/home'
import { onLoad } from '@dcloudio/uni-app'
const XtxGuessRef = ref<XtxGuessInstance>()

const noticeVisible = ref(false)
const noticeContent = ref('')

// 读取 app 级会话标记：同一次启动过程中只允许展示一次系统公告。
const hasShownNoticeThisLaunch = () => {
  const app = getApp() as {
    globalData?: {
      hasShownSystemNotice?: boolean
    }
  }
  return !!app.globalData?.hasShownSystemNotice
}

// 写入 app 级会话标记：页面刷新或切换 tab 回来时不再重复弹窗。
const markNoticeShownThisLaunch = () => {
  const app = getApp() as {
    globalData?: {
      hasShownSystemNotice?: boolean
    }
  }
  if (!app.globalData) app.globalData = {}
  app.globalData.hasShownSystemNotice = true
}

const showSystemNotice = async () => {
  // 仅在本次应用启动会话中展示一次，避免首页刷新/回到首页重复弹出。
  if (hasShownNoticeThisLaunch()) return

  try {
    const res = await getNoticeAPI()
    // 后端公告可能为空字符串，空内容不弹窗。
    const content = res.result?.content?.trim()
    if (!content) return
    // 只有在拿到有效内容时才标记为已展示，避免接口异常导致本次会话无法再展示。
    markNoticeShownThisLaunch()
    noticeContent.value = content
    noticeVisible.value = true
  } catch (error) {
    console.error('获取系统公告失败:', error)
  }
}

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

const scrollTop = ref(0)
const onScroll = (e: any) => {
  scrollTop.value = e.detail.scrollTop
}

// 仅在点击按钮时触发滚动到顶部，避免滚动过程中的回写导致小程序端回弹
const scrollIntoView = ref('')

// 下拉刷新
const isTrigger = ref(false) // 是否在刷新？
const refreshThreshold = 120 // 下拉触发距离，值越大下拉幅度越大
const onRefresh = async () => {
  if (isTrigger.value) return
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
  // 启动后首次进入首页时触发公告检查（H5/小程序统一逻辑）。
  void showSystemNotice()
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
      @scroll="onScroll"
      @scrolltolower="onScrollBottom"
      refresher-enabled
      :refresher-threshold="refreshThreshold"
      :refresher-triggered="isTrigger"
      :scroll-into-view="scrollIntoView"
      scroll-with-animation
      @refresherrefresh="onRefresh"
      scroll-y
      class="scroll"
    >
      <view id="top-anchor"></view>
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
    <BackTop v-model="scrollIntoView" :scroll-top="scrollTop"></BackTop>
    <SystemNoticePopup v-model="noticeVisible" :content="noticeContent" />
  </view>
</template>

<style scoped lang="scss">
// h5导航栏是dom元素（建立在body里面page外面），占用空间，100%是继承剩余的空间
page {
  height: 100%;
}
.body {
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;
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
  }
}
</style>
