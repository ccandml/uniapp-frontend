<script setup lang="ts">
import { getClassifyAPI } from '@/service/classify'
import type { ClassifyData } from '@/types/classify'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const activeIndex = ref(0)
const classifyData = ref<ClassifyData[]>()
const getClassify = async () => {
  const res = await getClassifyAPI()
  console.log(res)
  classifyData.value = res.result
}
// 左侧点击事件
const onChange = (index: number) => {
  activeIndex.value = index
}
onLoad(() => {
  getClassify()
})
</script>

<template>
  <view class="classify">
    <view class="search">
      <uni-icons type="search" size="20" color="#ccc"></uni-icons>
      <text class="text">切尔西</text>
    </view>
    <view class="contain">
      <view class="left">
        <view
          v-for="(item, index) in classifyData"
          :key="item.id"
          class="item"
          :class="{ active: index === activeIndex }"
          @click="onChange(index)"
        >
          {{ item.name }}
        </view>
      </view>
      <scroll-view class="right" scroll-y>
        <view class="sub" v-for="item in classifyData?.[activeIndex]?.children" :key="item.id">
          <view class="top">
            <view class="title">{{ item.name }}</view>
            <navigator url="/pages/" open-type="navigate">
              <view class="more"
                >全部 <uni-icons type="right" size="25" color="#ccc"></uni-icons
              ></view>
            </navigator>
          </view>
          <view class="content">
            <navigator
              v-for="goods in item.goods"
              :key="goods.id"
              class="navigator"
              :url="`/pages/goodsDetail/goodsDetail?id=${goods.id}`"
              open-type="navigate"
            >
              <view class="a">
                <image :src="goods.picture" mode="scaleToFill" />
                <view class="text">
                  <view class="name">{{ goods.name }}</view>
                  <view class="price">￥{{ goods.price }}</view>
                </view>
              </view>
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style scoped lang="scss">
page {
  height: 100%;
}
.classify {
  /* #ifdef H5 */
  height: 100%;
  /* #endif */
  /* #ifndef H5 */
  height: 100vh;
  /* #endif */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .search {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    margin: 15rpx 20rpx;
    padding: 0 20rpx;
    height: 65rpx;
    border-radius: 60rpx;
    background-color: #f8f8f8;
    .text {
      margin-left: 15rpx;
      font-size: 25rpx;
      color: #ccc;
    }
  }
  .contain {
    display: flex;
    flex: 1;
    min-height: 0;

    .left {
      width: 200rpx;
      height: 100%;
      min-height: 0;
      overflow: auto;
      background-color: #f8f8f8;
      .item {
        color: $text-color-1;
        position: relative;
        width: 100%;
        text-align: center;
        font-size: 27rpx;
        padding: 30rpx 0;
        &::after {
          position: absolute;
          content: '';
          width: 65rpx;
          height: 1rpx;
          background-color: #ccc;
          left: 50%;
          transform: translateX(-50%);
          bottom: 0;
        }
      }
      .active {
        border-left: 8rpx solid $theme-color;
        background-color: #fff;
        &::after {
          content: none;
        }
      }
    }
    .right {
      padding: 20rpx;
      overflow: auto;
      min-height: 0;
      margin: 0 auto;
      .sub {
        .top {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title {
            font-size: 31rpx;
          }
          .more {
            display: flex;
            align-items: center;
            color: #ccc;
          }
        }
        .content {
          margin: 30rpx auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10rpx;
          .navigator {
            .a {
              height: 100%;
              display: flex;
              flex-direction: column;
              image {
                width: 100%;
                height: 180rpx;
              }
              .text {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                font-size: 22.5rpx;
                .price {
                  color: rgb(201, 11, 11);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
