<script lang="ts" setup>
import { getUserInfoAPI, updateUserInfoAPI, uploadImgAPI } from '@/service/userInfo'
import { useMemberStore } from '@/stores'
import type { Gender, ProfileDetail, RequestProfile } from '@/types/member'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const memberStore = useMemberStore()
// 用户信息
const userInfo = ref<ProfileDetail>()
const requestProfile = ref<RequestProfile>({
  nickname: '',
  gender: '未知',
  birthday: '',
  profession: '',
  cityCode: '',
  provinceCode: '',
  countyCode: '',
})
const goBack = () => {
  uni.navigateBack()
}
// 头像预览
const onPreview = () => {
  uni.previewImage({
    urls: [memberStore.profile!.avatar],
  })
}
// 修改头像
const onAvatorChange = () => {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      console.log(res)
      // H5端使用formdata上传数据请求接口
      // #ifdef H5
      const formData = new FormData()
      formData.append('file', (res.tempFiles as File[])[0]!)
      const result = await uploadImgAPI(formData)
      console.log(result)
      // #endif

      // 因为，浏览器使用uni.uploadFile其实是XMLHttpRequest 请求，没有实现代理

      // 小程序端直接使用uni.uploadFile上传数据
      // #ifndef H5
      uni.uploadFile({
        url: '/member/profile/avatar',
        fileType: 'image',
        filePath: res.tempFilePaths[0],
        name: 'file',
        success: (res) => {
          console.log(res)
        },
        fail: (error) => {
          console.log(error)
          uni.showToast({ icon: 'none', title: '意外的错误' })
        },
      })
      // #endif
    },
    fail: (error) => {},
  })
}
// 性别修改
const radioChange: UniHelper.RadioGroupOnChange = (e) => {
  console.log(e.detail.value)
  requestProfile.value!.gender = e.detail.value as Gender
}
// 日期修改
const onDateChange: UniHelper.DatePickerOnChange = (e) => {
  console.log(e)
  requestProfile.value.birthday = e.detail.value
}
// 城市修改
const onRegionChange: UniHelper.RegionPickerOnChange = (e) => {
  console.log(e.detail.value)
  // 展示
  userInfo.value!.fullLocation = e.detail.value.join(' ')
  // 请求
  requestProfile.value.provinceCode = e.detail.code![0]
  requestProfile.value.cityCode = e.detail.code![1]
  requestProfile.value.countyCode = e.detail.code![2]
}

// 提交修改
const submit = async () => {
  const res = await updateUserInfoAPI(requestProfile.value)
  console.log(res)
  console.log(requestProfile.value)
  // 修改pinia数据同步
  memberStore.profile!.nickname = requestProfile.value.nickname
  uni.showToast({
    title: '修改成功！',
    icon: 'success',
    mask: true,
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}
onLoad(async () => {
  const res = await getUserInfoAPI()
  console.log(res)
  userInfo.value = res.result
  requestProfile.value.nickname = userInfo.value.nickname
  requestProfile.value.gender = userInfo.value.gender
  requestProfile.value.birthday = userInfo.value.birthday
  requestProfile.value.profession = userInfo.value.profession
})
</script>

<template>
  <view class="userInfo">
    <image class="navimg" src="../../static/images/order_bg.png" mode="scaleToFill" />
    <view class="navbar">
      <uni-nav-bar
        class="nav"
        dark
        :fixed="true"
        background-color="transparent"
        status-bar
        left-icon="left"
        left-text="返回"
        title="个人信息"
        @clickLeft="goBack"
      />
      <view class="avator">
        <image @click="onPreview" :src="userInfo?.avatar" mode="aspectFill" />
      </view>
      <view @click="onAvatorChange" class="text"> 点击修改头像</view>
    </view>

    <view class="body">
      <view class="item">
        <view class="left">账号</view>
        <view class="right">{{ userInfo?.account }}</view>
      </view>
      <view class="item">
        <view class="left">昵称</view>
        <input class="right" type="text" v-model="requestProfile!.nickname" />
      </view>
      <view class="item">
        <view class="left">性别</view>
        <view class="right">
          <radio-group @change="radioChange" :value="requestProfile!.gender">
            <label class="uni-list-cell uni-list-cell-pd">
              <radio value="男" :checked="requestProfile?.gender === '男'" />
              男
            </label>
            <label class="uni-list-cell uni-list-cell-pd">
              <radio value="女" :checked="requestProfile?.gender === '女'" />
              女
            </label>
          </radio-group>
        </view>
      </view>
      <view class="item">
        <view class="left">生日</view>
        <view class="right">
          <picker class="" mode="date" :value="userInfo?.birthday" @change="onDateChange">
            <view class="value">{{ requestProfile?.birthday || '选择日期' }}</view>
          </picker>
        </view>
      </view>
      <view class="item">
        <view class="left">城市</view>
        <view class="right">
          <picker mode="region" @change="onRegionChange" :value="userInfo?.fullLocation">
            <view class="value">{{ userInfo?.fullLocation || '选择城市' }}</view>
          </picker>
        </view>
      </view>
      <view class="item">
        <view class="left">职业</view>
        <input class="right" type="text" v-model="requestProfile!.profession" />
      </view>
    </view>
    <view @click="submit" class="btn">保存</view>
  </view>
</template>

<style lang="scss" scoped>
page {
  height: 100%;
}
.userInfo {
  background-color: #eee;
  /* #ifdef H5 */
  height: 100%;
  /* #endif */
  /* #ifndef H5 */
  height: 100vh;
  /* #endif */
  .navimg {
    width: 100vw;
    position: absolute;
    top: 0;
  }
  .navbar {
    position: relative;
    z-index: 100;
    width: 100%;
    .nav {
      :deep(.uni-navbar--border) {
        border: none;
      }
    }
    .avator {
      width: 150rpx;
      height: 150rpx;
      margin: 20rpx auto;
      border-radius: 50%;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .text {
      width: fit-content;
      margin: 0 auto;
      font-size: 23rpx;
      color: #fff;
    }
  }

  .body {
    position: relative;
    z-index: 100;
    width: 90vw;
    margin: 100rpx auto;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 5rpx 20rpx;
    .item {
      padding: 30rpx 0;
      border-bottom: 1rpx solid #ccc;
      display: flex;
      align-items: center;
      &:last-child {
        border: none;
      }
      .left {
        width: 230rpx;
      }
      .right {
        // 单选框
        .uni-list-cell {
          width: fit-content;
          margin-right: 20rpx;
        }
      }
    }
  }
  .btn {
    width: 300rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    color: #fff;
    margin: 0 auto;
    background-color: $theme-color;
    border-radius: 40rpx;
  }
}
</style>
