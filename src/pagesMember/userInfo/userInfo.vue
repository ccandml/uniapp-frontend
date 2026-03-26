<script lang="ts" setup>
import { getUserInfoAPI, updateUserInfoAPI } from '@/service/userInfo'
import { useMemberStore } from '@/stores'
import CityPicker from '@/uni_modules/piaoyi-cityPicker/components/piaoyi-cityPicker/piaoyi-cityPicker.vue'
import type { Gender, ProfileDetail, RequestProfile } from '@/types/member'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const memberStore = useMemberStore()
// 用户信息
const userInfo = ref<ProfileDetail>()
const requestProfile = ref<RequestProfile>({
  username: '',
  gender: '未知',
  birthday: '',
  profession: '',
  fullLocation: '',
})
// 城市编码仅用于城市选择器默认值回显，不提交给资料更新接口
const selectedLocationCode = ref('')
const goBack = () => {
  uni.switchTab({
    url: '/pages/user/user',
  })
}
// 头像预览
const onPreview = () => {
  uni.previewImage({
    urls: [memberStore.profile!.avatar],
  })
}
// 修改头像
const onAvatorChange = async () => {
  const avatar = userInfo.value?.avatar || ''
  const { cancel, confirm, content } = await uni.showModal({
    title: '修改头像',
    editable: true,
    placeholderText: '请输入头像图片访问地址',
    content: avatar,
  })
  if (cancel || !confirm) return
  const avatarUrl = (content || '').trim()
  if (!avatarUrl) {
    uni.showToast({
      title: '头像地址不能为空',
      icon: 'none',
    })
    return
  }
  const urlPattern = /^https?:\/\/\S+$/i
  if (!urlPattern.test(avatarUrl)) {
    uni.showToast({
      title: '请输入 http/https 图片地址',
      icon: 'none',
    })
    return
  }

  // 头像更新独立于资料表单，直接单字段提交
  await updateUserInfoAPI({ avatar: avatarUrl })
  if (userInfo.value) {
    userInfo.value.avatar = avatarUrl
  }
  if (memberStore.profile) {
    memberStore.profile.avatar = avatarUrl
  }
  uni.showToast({
    title: '头像更新成功',
    icon: 'success',
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
const cityPickerVisible = ref(false)
const openMockPicker = () => {
  cityPickerVisible.value = true
}
const onCityPickerConfirm = (val: {
  code: string
  provinceName: string
  cityName: string
  areaName: string
}) => {
  requestProfile.value.fullLocation = `${val.provinceName} ${val.cityName} ${val.areaName}`
  selectedLocationCode.value = val.code
  cityPickerVisible.value = false
}
const onCityPickerCancel = () => {
  cityPickerVisible.value = false
}

// 提交修改
const submit = async () => {
  const res = await updateUserInfoAPI(requestProfile.value)
  console.log(res)
  console.log(requestProfile.value)
  // 修改pinia数据同步
  memberStore.profile!.username = requestProfile.value.username
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
  const profileWithCode = res.result as ProfileDetail & {
    locationCode?: string
  }
  requestProfile.value.username = userInfo.value.username
  requestProfile.value.gender = userInfo.value.gender
  requestProfile.value.birthday = userInfo.value.birthday
  requestProfile.value.profession = userInfo.value.profession
  requestProfile.value.fullLocation = userInfo.value.fullLocation || ''
  selectedLocationCode.value = profileWithCode.locationCode || ''
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
        <view class="right">用户{{ userInfo?.id }}</view>
      </view>
      <view class="item">
        <view class="left">昵称</view>
        <input class="right" type="text" v-model="requestProfile!.username" />
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
          <view class="value region-trigger" @click="openMockPicker">
            {{ requestProfile.fullLocation || '选择城市' }}
          </view>
        </view>
      </view>
      <view class="item">
        <view class="left">职业</view>
        <input class="right" type="text" v-model="requestProfile!.profession" />
      </view>
    </view>
    <view @click="submit" class="btn">保存</view>
    <CityPicker
      :column="3"
      :default-value="selectedLocationCode"
      :mask-close-able="true"
      :visible="cityPickerVisible"
      @confirm="onCityPickerConfirm"
      @cancel="onCityPickerCancel"
    />
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

        .region-trigger {
          color: #333;
          padding: 8rpx 0;
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
