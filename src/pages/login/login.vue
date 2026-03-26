<script lang="ts" setup>
import { numberLoginAPI, wxLoginAPI, buildLoginAPI } from '@/service/login'
import { useMemberStore } from '@/stores'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const memberStore = useMemberStore()

// H5端登录
// #ifdef H5
const formData = ref({
  account: '13123456789',
  password: '',
})
const form = ref()
const rules: UniHelper.UniFormsRules = {
  account: {
    rules: [
      {
        required: true,
        errorMessage: '请填写手机号',
      },
      {
        pattern: '^1[3-9]\\d{9}$',
        errorMessage: '请输入正确的手机号',
      },
    ],
  },
  password: {
    rules: [
      {
        required: true,
        errorMessage: '请填密码',
      },
      {
        pattern: '^[a-zA-Z0-9]{6,10}$',
        errorMessage: '请输入6~10位字母数字',
      },
    ],
  },
}
// #endif

// #ifndef H5
// 微信快捷登录
let code: string
onLoad(() => {
  wx.login({
    success: (res) => {
      console.log(res)
      code = res.code
    },
  })
})
const onGetPhoneNumber: UniHelper.ButtonOnGetphonenumber = async (res) => {
  console.log(res)
  const encryptedData = res.detail.encryptedData!
  const iv = res.detail.iv!
  const r = await wxLoginAPI({ code, encryptedData, iv })
  console.log(r)
  loginSuccess()
}
// #endif

// #ifdef H5
const onSubmit = async () => {
  await form.value.validate()
  const res = await numberLoginAPI(formData.value)
  console.log(res)
  memberStore.setProfile(res.result)
  loginSuccess()
}
// #endif

// 更多登录
const simpleLogin = async () => {
  const res = await buildLoginAPI()
  console.log(res)
  memberStore.setProfile(res.result)
  loginSuccess()
}

const loginSuccess = () => {
  uni.showToast({ icon: 'success', title: '登陆成功！' })
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}
</script>

<template>
  <view class="login">
    <image src="../../static//images//logo_icon.png" mode="widthFix" />

    <!-- #ifdef H5 -->
    <uni-forms validate-trigger="blur" ref="form" v-model="formData" :rules="rules">
      <uni-forms-item required name="account">
        <uni-easyinput v-model="formData.account" type="text" placeholder="请输入手机号" />
      </uni-forms-item>
      <uni-forms-item required name="password">
        <uni-easyinput v-model="formData.password" type="password" />
      </uni-forms-item>
    </uni-forms>
    <view class="button">
      <view class="showbutton">登录</view>
      <button @click="onSubmit">登录</button>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="button">
      <view class="showbutton">快捷登录</view>
      <button open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber" @click="onSubmit">
        登录
      </button>
    </view>
    <!-- #endif -->
    <view class="moreLogin">
      --------------其他登录方式--------------
      <view @click="simpleLogin" class="more">
        <uni-icons type="contact" size="40" color="#ccc"></uni-icons>
      </view>
    </view>

    <view class="contract">登录/注册即视为你同意《服务条款》和《晨曦优选隐私协议》</view>
  </view>
</template>

<style lang="scss" scoped>
.login {
  image {
    width: 250rpx;
    height: 250rpx;
    display: block;
    margin: 200rpx auto;
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
  // 表单
  .uni-easyinput {
    width: 85vw;
    margin: 0 auto;
  }
  // 边框色
  :deep(.uni-easyinput .is-focused) {
    border-color: $theme-color !important;
  }
  // 选中时图标颜色
  :deep(.uni-easyinput .is-focused .uni-icons) {
    color: $theme-color !important;
  }
  :deep(.uni-easyinput__content) {
    border-radius: 30rpx;
    overflow: hidden;
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
    margin: 40rpx auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    .more {
      margin-top: 30rpx;
    }
  }
}
</style>
