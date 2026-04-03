<script lang="ts" setup>
import { delMemberAddressDetailAPI, getMemberAddressAPI } from '@/service/address'
import { useAddressStore } from '@/stores'
import type { AddressItem } from '@/types/address'
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

// 请求数据
const addressList = ref<AddressItem[]>()
const getMemberAddress = async () => {
  try {
    const res = await getMemberAddressAPI()
    console.log(res)
    addressList.value = res.result
  } catch {
    // 401 时请求层会统一跳转登录
  }
}
// 滑动
const options = ref<UniHelper.UniSwipeActionItemOption[]>([
  {
    text: '取消',
    style: {
      backgroundColor: '#22a6f1',
      color: '#fff',
      fontSize: '25rpx',
    },
  },
  {
    text: '删除',
    style: {
      backgroundColor: '#27ba9b',
      color: '#fff',
      fontSize: '25rpx',
    },
  },
])
// 删除地址
const swipeActionRef = ref<UniHelper.UniSwipeActionInstance>()
const onDel = (e: UniHelper.UniSwipeActionItemOnClickEvent, id: string) => {
  if (e.index === 1) {
    uni.showModal({
      title: '确定要删除吗？',
      success: async (res) => {
        if (res.confirm) {
          const res = await delMemberAddressDetailAPI(id)
          console.log(res)
          getMemberAddress()
        }
      },
    })
  } else {
    swipeActionRef.value!.closeAll!()
  }
}
// 选择地址 传递到仓库
const addressStore = useAddressStore()
const onSelect = (e: AddressItem) => {
  addressStore.selectAddress(e)
  uni.navigateBack()
}
onShow(() => {
  getMemberAddress()
})
</script>

<template>
  <view class="manageAdress">
    <view class="card" v-if="addressList?.length">
      <uni-swipe-action ref="swipeActionRef">
        <view class="item" @click="onSelect(item)" v-for="item in addressList" :key="item.id">
          <uni-swipe-action-item @click="(e) => onDel(e, item.id)" :right-options="options">
            <view class="top">
              <view class="left active">
                <view class="name">{{ item.receiver }}</view>
                <view class="phone">{{ item.contact }}</view>
                <view v-if="item.isDefault" class="active">默认</view>
              </view>
              <navigator @tap.stop :url="`/pagesMember/changeAdress/changeAdress?id=${item.id}`">
                <view class="right">修改</view>
              </navigator>
            </view>
            <view class="bottom">{{ item.fullLocation }} {{ item.address }}</view>
          </uni-swipe-action-item>
        </view>
      </uni-swipe-action>
    </view>
    <view v-else class="none">还没有地址哦~</view>
    <navigator url="/pagesMember/changeAdress/changeAdress">
      <view class="btn">新建地址</view>
    </navigator>
  </view>
</template>

<style lang="scss" scoped>
page {
  height: 100%;
}
.manageAdress {
  /* #ifdef H5 */
  height: 100%;
  /* #endif */
  /* #ifndef H5 */
  height: 100vh;
  /* #endif */
  background-color: #eee;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .none {
    width: fit-content;
    margin: 30rpx auto;
    margin-top: 150rpx;
    color: $text-color-1;
  }
  .card {
    margin: 20rpx auto;
    width: 95vw;
    padding: 0 30rpx;
    background-color: #fff;
    border-radius: 15rpx;
    overflow: auto;
    height: fit-content;
    .item {
      border-bottom: 1px solid #eee;
      padding: 20rpx 0;
      &:last-child {
        border: none;
      }
      :deep(.button-group--right) {
        overflow: hidden;
        padding-left: 20rpx;
        .uni-swipe_button {
          overflow: hidden;
          &:nth-child(1) {
            border-radius: 20rpx 0 0 20rpx;
          }
          &:nth-child(2) {
            border-radius: 0 20rpx 20rpx 0;
          }
        }
      }
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          display: flex;
          align-items: center;
          .name {
            width: 100rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .phone {
            margin: 0 20rpx;
          }
          .active {
            padding: 0 15rpx;
            border: 1rpx solid $theme-color;
            border-radius: 30rpx;
            font-size: 22rpx;
            color: $theme-color;
          }
        }
        .right {
          padding-left: 20rpx;
          border-left: 1rpx solid #ccc;
          line-height: normal;
        }
      }
      .bottom {
        margin-top: 10rpx;
      }
    }
  }
  .btn {
    width: 80vw;
    margin: 100rpx auto;
    text-align: center;
    background-color: $theme-color;
    padding: 20rpx 0;
    color: #fff;
    border-radius: 100rpx;
  }
}
</style>
