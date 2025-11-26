<script setup lang="ts">
import { getGuessAPI } from '@/service/home'
import { onMounted, ref } from 'vue'
import type { GuessList } from '../types/home'
import type { PagesRequest } from '../types/global'

const data = ref<PagesRequest>({
  page: 1,
  pageSize: 10,
})
// 重置状态
const resetData = () => {
  data.value.page = 1
  isFinish.value = false
  guessList.value = []
}
// 请求状态
const isFinish = ref(false)
const guessList = ref<GuessList[]>([])
const getGuessList = async () => {
  // 停止请求
  if (isFinish.value) {
    return
  }
  const res = await getGuessAPI(data.value)

  guessList.value = [...guessList.value, ...res.result.items]
  data.value.page++
  console.log(res)
  // 到底了
  if (res.result.items.length < data.value.pageSize) {
    isFinish.value = true
  }
}

// 暴露请求方法
defineExpose({
  getGuessList,
  resetData,
})

onMounted(() => {
  getGuessList()
})
</script>

<template>
  <view class="guess">
    <view class="top">
      <image src="../../static/images/bubble.png" mode="aspectFill" />
      猜你喜欢
      <image src="../../static/images/bubble.png" mode="aspectFill" />
    </view>
    <view class="content">
      <navigator
        class="item"
        v-for="item in guessList"
        :key="item.id"
        url="/pages/"
        open-type="navigate"
        hover-class="navigator-hover"
      >
        <image :src="item.picture" mode="aspectFill" />
        <view class="text">{{ item.name }}</view>
        <view class="monney">￥{{ item.price }}</view>
      </navigator>
    </view>
    <!-- 加载中。。。 -->
    <view v-if="!isFinish" class="loading">
      <uni-icons type="spinner-cycle" size="25"></uni-icons>
      加载中...
    </view>
    <view v-else class="loading"> 已经到底了~ </view>
  </view>
</template>

<style scoped lang="scss">
.guess {
  width: 95vw;
  margin: 0 auto;
  .top {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 35rpx auto;
    image {
      width: 30rpx;
      height: 30rpx;
      margin: 0 10rpx;
    }
  }
  .content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15rpx;
    .item {
      background-color: #fff;
      border-radius: 15rpx;
      padding: 20rpx;
      image {
        width: 310rpx;
        height: 310rpx;
        display: block;
        border-radius: 15rpx;
      }

      .monney {
        color: rgb(212, 55, 55);
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
</style>
