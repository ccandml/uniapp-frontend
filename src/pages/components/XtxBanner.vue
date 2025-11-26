<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { BannerList } from '../types/home'
import { getBannerAPI } from '@/service/home'

/* import type { PropType } from 'vue'
defineProps({
  list: {
    type: Array as PropType<BannerList[]>,
  },
}) */
const props = defineProps<{ list: BannerList[] }>()

const activeIndex = ref<number>(0)
const onChange: UniHelper.SwiperOnChange = (e) => {
  // console.log(e.detail.current)
  activeIndex.value = e.detail.current
}
</script>

<template>
  <view class="banner">
    <swiper autoplay circular @change="onChange">
      <swiper-item v-for="item in list" :key="item.id">
        <navigator class="img" url="" open-type="navigate" hover-class="navigator-hover">
          <image :src="item.imgUrl" mode="aspectFill" />
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 轮播点 -->
    <view class="bannerDots">
      <view
        class="item"
        :class="{ active: activeIndex === index }"
        v-for="(item, index) in list.length"
        :key="item"
      ></view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.banner {
  position: relative;
  swiper {
    width: 100%;
    swiper-item {
      width: 100%;
      .img {
        image {
          width: 100%;
          height: 300rpx;
        }
      }
    }
  }

  .bannerDots {
    position: absolute;
    display: flex;
    bottom: 20rpx;
    left: 0;
    right: 0;
    margin: 0 auto;
    justify-content: center;
    .item {
      background-color: rgba($color: #fff, $alpha: 0.6);
      width: 30rpx;
      height: 6rpx;
      margin: 0 8rpx;
    }
    .active {
      background-color: #fff;
    }
  }
}
</style>
