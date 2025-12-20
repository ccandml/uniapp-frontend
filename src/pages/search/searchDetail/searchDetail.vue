<script setup lang="ts">
import { getGuessAPI } from '@/service/home'
import { ref } from 'vue'
import type { GuessList } from '@/types/home'
import type { PagesRequest } from '@/types/global'
import { onLoad } from '@dcloudio/uni-app'
import { getSearchListAPI } from '@/service/search'

const data = ref<PagesRequest>({
  page: 1,
  pageSize: 10,
})
// 没写完  接口问题

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

onLoad(async () => {
  const res = await getSearchListAPI({
    page: 1,
    pageSize: 10,
    keyword: '橘子',
  })
  console.log(res)
})
</script>

<template>
  <view class="guess">
    <view class="content">
      <navigator
        class="navigator"
        v-for="item in guessList"
        :key="item.id"
        url="/pages/"
        open-type="navigate"
        hover-class="navigator-hover"
      >
        <view class="a">
          <image :src="item.picture" mode="aspectFill" />
          <view class="text">
            <view>{{ item.name }}</view>
            <view class="monney">￥{{ item.price }}</view>
          </view>
        </view>
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
  width: 100%;
  margin: 0 auto;
  .content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15rpx;
    .navigator {
      background-color: #fff;
      border-radius: 15rpx;
      padding: 20rpx;
      .a {
        height: 100%;
        display: flex;
        flex-direction: column;
        image {
          width: 310rpx;
          height: 310rpx;
          display: block;
          border-radius: 15rpx;
        }
        .text {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
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
</style>
