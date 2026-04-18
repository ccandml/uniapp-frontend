<script lang="ts" setup>
import { wechatLoginAPI, buildLoginAPI, stringLoginAPI } from '@/service/login'
import { useMemberStore } from '@/stores'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const memberStore = useMemberStore()
const redirectUrl = ref('')
const TAB_BAR_PAGES = [
  '/pages/index/index',
  '/pages/classify/classify',
  '/pages/cart/cart',
  '/pages/user/user',
]

onLoad((options) => {
  redirectUrl.value = decodeURIComponent((options?.redirect as string) || '')
})

// H5端登录
// #ifdef H5
const formData = ref({
  username: '',
  password: '',
})
const form = ref()
const rules: UniHelper.UniFormsRules = {
  username: {
    rules: [
      {
        required: true,
        errorMessage: '请填写用户名',
      },
    ],
  },
  password: {
    rules: [
      {
        required: true,
        errorMessage: '请填写密码',
      },
      {
        pattern: '^[a-zA-Z0-9]{6,10}$',
        errorMessage: '请输入6~10位字母数字',
      },
    ],
  },
}

const onSubmit = async () => {
  try {
    await form.value.validate()
    const res = await stringLoginAPI(formData.value)
    memberStore.setProfile(res.result)
    loginSuccess()
  } catch (error) {
    uni.showToast({ icon: 'none', title: '登录失败，请检查账号密码' })
  }
}
// #endif

// #ifndef H5
// 微信快捷登录：点击时实时获取 code，避免页面停留过久导致 code 失效。
const getWechatCode = () => {
  return new Promise<string>((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (res) => {
        if (res.code) {
          resolve(res.code)
          return
        }
        reject(new Error(res.errMsg || '获取微信 code 失败'))
      },
      fail: reject,
    })
  })
}

const wechatLogin = async () => {
  try {
    const code = await getWechatCode()
    const res = await wechatLoginAPI({ code })
    memberStore.setProfile(res.result)
    loginSuccess()
  } catch (error) {
    uni.showToast({ icon: 'none', title: '微信登录失败，请稍后再试' })
  }
}
// #endif

// 更多登录
const simpleLogin = async () => {
  try {
    const res = await buildLoginAPI()
    console.log(res)
    memberStore.setProfile(res.result)
    loginSuccess()
  } catch (error) {
    uni.showToast({ icon: 'none', title: '登录失败，请稍后再试' })
  }
}

const loginSuccess = () => {
  uni.showToast({ icon: 'success', title: '登陆成功！' })
  setTimeout(() => {
    // 如果有来源页，优先回跳来源；tabBar 页面必须使用 switchTab
    if (redirectUrl.value) {
      const path = redirectUrl.value.split('?')[0] || ''
      if (TAB_BAR_PAGES.includes(path)) {
        uni.switchTab({ url: path })
      } else {
        uni.redirectTo({ url: redirectUrl.value })
      }
      return
    }
    uni.navigateBack()
  }, 1000)
}

const goRegister = () => {
  uni.navigateTo({ url: '/pagesAuth/register/register' })
}
</script>

<template>
  <view class="login">
    <image src="../static/images/logo_icon.png" mode="widthFix" />

    <!-- #ifdef H5 -->
    <uni-forms validate-trigger="blur" ref="form" v-model="formData" :rules="rules">
      <uni-forms-item required name="username">
        <uni-easyinput v-model="formData.username" type="text" placeholder="请输入用户名" />
      </uni-forms-item>
      <uni-forms-item required name="password">
        <uni-easyinput v-model="formData.password" type="password" placeholder="请输入密码" />
      </uni-forms-item>
    </uni-forms>
    <view class="button">
      <view class="showbutton">登录</view>
      <button @click="onSubmit">登录</button>
    </view>
    <view class="register-button" @click="goRegister">去注册</view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="button">
      <view class="showbutton" @click="wechatLogin">微信登录</view>
    </view>
    <!-- #endif -->
    <view class="moreLogin">
      --------------快捷登录--------------
      <view @click="simpleLogin" class="more">
        <uni-icons type="contact" size="40" color="#ccc"></uni-icons>
      </view>
    </view>
    <!-- #ifndef H5 -->
    <view class="contract1">微信用户首次登录直接注册</view>
    <!-- #endif -->
    <view class="contract">登录/注册即视为你同意《服务条款》和《晨曦优选隐私协议》</view>
  </view>
</template>

<style lang="scss" scoped>
.login {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  image {
    width: 250rpx;
    height: 250rpx;
    display: block;
    margin: 140rpx auto;
  }

  .button {
    position: relative;
    button {
      width: 57vw;
      height: 78rpx;
      opacity: 0;
    }
    .showbutton {
      background-color: $theme-color;
      width: 60vw;
      height: 80rpx;
      position: absolute;
      left: 0;
      right: 0;
      margin: 0 auto;
      border-radius: 40rpx;
      line-height: 80rpx;
      text-align: center;
      color: white;
    }
  }

  .register-button {
    width: fit-content;
    margin: 36rpx auto 0;
    color: $theme-color;
    font-size: 28rpx;
  }
  // 表单
  :deep(.uni-forms-item) {
    margin-bottom: 30rpx;
  }
  .uni-easyinput {
    width: 85vw;
    margin: 0 auto;
  }
  :deep(.uni-easyinput__content) {
    border-radius: 50rpx;
    border: 2rpx solid #e8e8e8;
    padding: 12rpx 16rpx !important;
    transition: all 0.3s ease;
    background-color: #f9f9f9;
  }
  // 边框色
  :deep(.uni-easyinput .is-focused) {
    border-color: $theme-color !important;
    background-color: #fff !important;
    box-shadow: 0 0 8rpx rgba(255, 87, 34, 0.2) !important;
  }
  // 选中时图标颜色
  :deep(.uni-easyinput .is-focused .uni-icons) {
    color: $theme-color !important;
  }
  // placeholder 样式
  :deep(.uni-easyinput input::placeholder) {
    color: #bbb;
    font-size: 14px;
  }

  .contract1 {
    color: $text-color-2;
    font-size: 22rpx;
    position: fixed;
    bottom: 120rpx;
    left: 0;
    right: 0;
    width: fit-content;
    margin: 0 auto;
  }
  .contract {
    color: $text-color-2;
    font-size: 22rpx;
    position: fixed;
    bottom: 80rpx;
    left: 0;
    right: 0;
    width: fit-content;
    margin: 0 auto;
  }

  .moreLogin {
    color: #ccc;
    /* #ifdef H5 */
    margin: 38rpx auto 0;
    /* #endif */
    /* #ifndef H5 */
    margin: 138rpx auto 0;
    /* #endif */
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    .more {
      margin-top: 30rpx;
    }
  }
}
</style>
