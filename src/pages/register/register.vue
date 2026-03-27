<script lang="ts" setup>
import { registerAPI } from '@/service/register'
import { ref } from 'vue'

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
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
  confirmPassword: {
    rules: [
      {
        required: true,
        errorMessage: '请再次输入密码',
      },
    ],
  },
}

const onSubmit = async () => {
  await form.value.validate()
  if (formData.value.password !== formData.value.confirmPassword) {
    uni.showToast({ icon: 'none', title: '两次密码输入不一致' })
    return
  }

  await registerAPI({
    username: formData.value.username,
    password: formData.value.password,
  })

  uni.showToast({ icon: 'success', title: '注册成功' })
  setTimeout(() => {
    uni.navigateBack()
  }, 800)
}
</script>

<template>
  <view class="register">
    <image src="../../static//images//logo_icon.png" mode="widthFix" />

    <uni-forms validate-trigger="blur" ref="form" v-model="formData" :rules="rules">
      <uni-forms-item required name="username">
        <uni-easyinput v-model="formData.username" type="text" placeholder="请输入用户名" />
      </uni-forms-item>
      <uni-forms-item required name="password">
        <uni-easyinput v-model="formData.password" type="password" placeholder="请输入密码" />
      </uni-forms-item>
      <uni-forms-item required name="confirmPassword">
        <uni-easyinput
          v-model="formData.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
        />
      </uni-forms-item>
    </uni-forms>

    <view class="button">
      <view class="showbutton">注册</view>
      <button @click="onSubmit">注册</button>
    </view>

    <view class="contract">登录/注册即视为你同意《服务条款》和《晨曦优选隐私协议》</view>
  </view>
</template>

<style lang="scss" scoped>
.register {
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

  :deep(.uni-easyinput .is-focused) {
    border-color: $theme-color !important;
    background-color: #fff !important;
    box-shadow: 0 0 8rpx rgba(255, 87, 34, 0.2) !important;
  }

  :deep(.uni-easyinput .is-focused .uni-icons) {
    color: $theme-color !important;
  }

  :deep(.uni-easyinput input::placeholder) {
    color: #bbb;
    font-size: 14px;
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
}
</style>
