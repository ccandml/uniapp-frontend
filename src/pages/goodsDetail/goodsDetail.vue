<script lang="ts" setup>
import { addCartAPI, getCartAPI } from '@/service/cart'
import AddressCom from './components/AddressCom.vue'
import { getGoodsDetailAPI } from '@/service/goodsDetail'
import type { GoodsResult } from '@/types/goodsDetail'
import type {
  SkuPopupEvent,
  SkuPopupInstance,
  SkuPopupLocaldata,
} from '@/types/vk-data-goods-sku-popup'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { useAddressStore, useMemberStore } from '@/stores'
// 安全区
const { safeAreaInsets } = uni.getSystemInfoSync()
const safeBottom = safeAreaInsets?.bottom
// 底部导航栏
const options = ref([
  {
    icon: 'shop' as UniHelper.UniIconsType,
    text: '店铺',
  },
  {
    icon: 'chat' as UniHelper.UniIconsType,
    text: '客服',
    info: 2,
    infoBackgroundColor: '#27ba9b',
    infoColor: '#f5f5f5',
  },

  {
    icon: 'cart' as UniHelper.UniIconsType,
    text: '购物车',
    info: 0,
    infoBackgroundColor: '#27ba9b',
    infoColor: '#f5f5f5',
  },
])
const buttonGroup = ref([
  {
    text: '加入购物车',
    backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
    color: '#fff',
  },
  {
    text: '立即购买',
    backgroundColor: 'linear-gradient(135deg, #1ca789, #27ba9b)',
    color: '#fff',
  },
])
// 收货地址
const addressStore = useAddressStore()
const addressParams = computed(() => {
  return addressStore.addressSelectedItem
    ? addressStore.addressSelectedItem.fullLocation +
        ' ' +
        addressStore.addressSelectedItem.address +
        ' ' +
        addressStore.addressSelectedItem.receiver +
        ' ' +
        addressStore.addressSelectedItem.contact
    : '请选择收货地址'
})

// 右侧按钮
const buyBotton: UniHelper.UniGoodsNavOnButtonClick = (e) => {
  if (e.index === 0) {
    mode.value = skuMode.cart
    isSkuShow.value = true
  } else {
    mode.value = skuMode.buy
    isSkuShow.value = true
  }
}
// 左侧按钮
const onClickLeft: UniHelper.UniGoodsNavOnClick = (e) => {
  // 去购物车
  if (e.index === 2) {
    uni.navigateTo({ url: '/pages/cart/cart2/cart2' })
  }
}
// 接收参数
const query = defineProps<{ id: string }>()
const goodsData = ref<GoodsResult>()
// 请求数据
const getGoods = async () => {
  const res = await getGoodsDetailAPI(query.id)
  goodsData.value = res.result
  console.log(res)
  // 将数据赋给sku
  localdata.value = {
    _id: res.result.id,
    name: res.result.name,
    goods_thumb: res.result.mainPictures[0]!,
    spec_list: res.result.specs.map((item) => {
      return {
        name: item.name,
        list: item.values.map((i) => {
          return { name: i.name }
        }),
      }
    }),
    sku_list: res.result.skus.map((item) => {
      return {
        _id: item.id,
        goods_id: res.result.id,
        goods_name: res.result.name,
        image: item.picture,
        price: item.price * 100,
        stock: item.inventory,
        // 1 可购买，0 不可购买；未返回时默认可购买
        available: item.available ?? 1,
        sku_name_arr: item.specs.map((i) => i.valueName),
      }
    }),
  }
}
// 图片下标
const num = ref(0)
const onChange: UniHelper.SwiperOnChange = (e) => {
  num.value = e.detail.current
}
// 预览图片
const onPreview = () => {
  uni.previewImage({
    urls: goodsData.value!.mainPictures,
    current: num.value,
    loop: true,
    indicator: 'number',
  })
}
// sku组件
const isSkuShow = ref(false)
const skuRef = ref<SkuPopupInstance>()
const localdata = ref<SkuPopupLocaldata>()
enum skuMode {
  all = 1,
  cart = 2,
  buy = 3,
}
const mode = ref<skuMode>(skuMode.all)
const openSkuPopup = (e: skuMode) => {
  mode.value = e
  isSkuShow.value = true
}
const skuValue = computed(() => {
  return skuRef.value?.selectArr?.join(' ').trim() || '请选择规格'
})
// 添加购物车
const onAddCart = async (e: SkuPopupEvent) => {
  const res = await addCartAPI({ skuId: e._id, count: e.buy_num })
  console.log(res)
  await updateCartBadge()
  uni.showToast({
    icon: 'success',
    title: '添加成功',
  })
  isSkuShow.value = false
}
// 立即购买
// 登录状态
const memberStore = useMemberStore()
const onBuy = async (e: SkuPopupEvent) => {
  if (memberStore.profile?.access_token) {
    uni.navigateTo({ url: `/pagesOrder/writeOrder/writeOrder?skuId=${e._id}&count=${e.buy_num}` })
  } else {
    uni.navigateTo({ url: '/pagesAuth/login/login' })
  }
}

// 购物车角标：实时展示购物车商品总数量
const updateCartBadge = async () => {
  const cartOption = options.value[2]
  if (!cartOption) return

  if (!memberStore.profile?.access_token) {
    cartOption.info = 0
    return
  }
  const res = await getCartAPI()
  const totalCount = res.result.reduce((sum, item) => sum + item.count, 0)
  cartOption.info = totalCount > 99 ? 99 : totalCount
}

onLoad(() => {
  getGoods()
  updateCartBadge()
})
onShow(() => {
  updateCartBadge()
})
const popup = ref()
</script>

<template>
  <!-- sku组件 -->
  <vk-data-goods-sku-popup
    ref="skuRef"
    v-model="isSkuShow"
    :mode="mode"
    :localdata="localdata"
    add-cart-background-color="#ffaa33"
    buy-now-background-color="#27ba9b"
    :actived-style="{
      color: '#27BA9B',
      borderColor: '#27BA9B',
      backgroundColor: '#e8f8f5',
    }"
    border-radius="20"
    @add-cart="onAddCart"
    @buy-now="onBuy"
  ></vk-data-goods-sku-popup>
  <div class="goodsDetail">
    <view class="top">
      <view class="preview">
        <view class="number">{{ num + 1 }} / {{ goodsData?.mainPictures.length }}</view>
        <swiper @change="onChange" autoplay circular>
          <swiper-item v-for="item in goodsData?.mainPictures" :key="item">
            <image @click="onPreview" :src="item" mode="aspectFill" />
          </swiper-item>
        </swiper>
      </view>

      <view class="price">￥{{ goodsData?.price }}</view>
      <view class="desc">
        <view class="name">{{ goodsData?.name }}</view>
        <view class="desc1">{{ goodsData?.desc }}</view>
      </view>
      <view class="item" @click="openSkuPopup(skuMode.all)">
        <view class="left"
          >选择
          <view class="center">{{ skuValue }}</view>
        </view>
        <uni-icons class="right" type="right" size="25" color="#ccc"></uni-icons>
      </view>
      <navigator url="/pagesMember/manageAdress/manageAdress">
        <view class="item">
          <view class="left"
            >送至
            <view class="center">{{ addressParams }}</view>
          </view>
          <uni-icons class="right" type="right" size="25" color="#ccc"></uni-icons> </view
      ></navigator>

      <view class="item">
        <view class="left"
          >服务
          <view class="center">无忧退 快速退款 免费包邮</view>
        </view>
      </view>
    </view>
    <view class="detail">
      <view class="top">
        <view class="text">详情</view>
      </view>
      <view class="item" v-for="item in goodsData?.details.properties" :key="item.name">
        <view class="left">{{ item.name }} </view>
        <view class="center">{{ item.value }}</view>
      </view>
    </view>
    <view class="img">
      <image v-for="item in goodsData?.details.pictures" :key="item" :src="item" mode="widthFix" />
    </view>
    <uni-goods-nav
      class="bottom"
      :options="options"
      :button-group="buttonGroup"
      :style="{ 'padding-bottom': safeBottom + 'px' }"
      :fill="true"
      @button-click="buyBotton"
      @click="onClickLeft"
    />
  </div>
  <uni-popup ref="popup" type="bottom" background-color="#fff" border-radius="10px 10px 0 0">
    <AddressCom></AddressCom>
  </uni-popup>
</template>

<style scoped lang="scss">
.goodsDetail {
  background-color: #eee;
  min-height: 100vh;
  padding-bottom: 180rpx;
  .top {
    background-color: white;
    .preview {
      position: relative;
      .number {
        position: absolute;
        right: 20rpx;
        bottom: 20rpx;
        z-index: 99;
        background-color: rgba(0, 0, 0, 0.15);
        padding: 5rpx 20rpx;
        border-radius: 30rpx;
        color: #fff;
        font-size: 25rpx;
      }
      swiper {
        height: 750rpx;
        width: 750rpx;
        position: relative;
        swiper-item {
          width: 100%;
          height: 100%;
          image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .price {
      width: 100%;
      height: 120rpx;
      background-color: $theme-color;
      line-height: 120rpx;
      padding-left: 30rpx;
      font-size: 50rpx;
      color: white;
    }
    .desc {
      padding: 30rpx;
      .desc1 {
        font-size: 25rpx;
        color: rgb(212, 55, 55);
        padding-top: 7rpx;
      }
    }
    .item {
      display: flex;
      justify-content: space-between;
      padding: 20rpx 30rpx;
      border-top: 1px solid #eee;
      .left {
        display: flex;
        color: $text-color-2;
        .center {
          margin-left: 30rpx;
          font-size: 27rpx;
          width: 550rpx;
        }
      }
      .right {
        width: fit-content;
        margin-right: 0;
      }
    }
  }

  .detail {
    background-color: white;
    margin-top: 30rpx;
    .top {
      padding: 30rpx;
      .text {
        padding-left: 10rpx;
        border-left: 5rpx solid $theme-color;
        font-weight: 600;
        font-size: 35rpx;
        line-height: 35rpx;
      }
    }
    .item {
      font-size: 27rpx;
      display: flex;
      padding: 30rpx;
      border-bottom: 1px solid #eee;
      .left {
        width: 250rpx;
        color: $text-color-2;
      }
    }
  }
  .img {
    image {
      width: 100%;
      display: block;
    }
  }
  .bottom {
    background-color: #fff;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    padding-top: 20rpx;
  }
}
</style>
