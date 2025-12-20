<script lang="ts" setup>
import {
  addMemberAddressDetailAPI,
  getMemberAddressDetailAPI,
  updateMemberAddressDetailAPI,
} from '@/service/address'
import type { AddressParams } from '@/types/address'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// 初始数据
const paramsData = ref<AddressParams>({
  receiver: '',
  contact: '',
  provinceCode: '',
  cityCode: '',
  countyCode: '',
  address: '',
  isDefault: 0,
})
// 接收参数
const query = defineProps<{ id?: string }>()
uni.setNavigationBarTitle({
  title: query.id ? '修改地址' : '新增地址',
})
// 回显数据
const fullLocationData = ref<string>() //用作回显
const getMemberAddressDetail = async () => {
  if (query.id) {
    uni.showLoading({ title: '全力加载中' })
    const res = await getMemberAddressDetailAPI(query.id)
    uni.hideLoading()
    console.log(res)
    const { id, fullLocation, ...params } = res.result //临时变量，允许在解构赋值时直接用新变量
    paramsData.value = params
    fullLocationData.value = fullLocation
  }
}
// 修改地区
const onRegionChange: UniHelper.RegionPickerOnChange = (e) => {
  console.log(e)
  paramsData.value.provinceCode = e.detail.code![0]
  paramsData.value.cityCode = e.detail.code![1]
  paramsData.value.countyCode = e.detail.code![2]
  fullLocationData.value = e.detail.value.join(' ')
}
// 修改默认地址
const onSwitchChange: UniHelper.SwitchOnChange = (e) => {
  console.log(e)
  paramsData.value.isDefault = e.detail.value ? 1 : 0
}
// 表单校验
const formRef = ref()
const rules: UniHelper.UniFormsRules = {
  receiver: {
    rules: [{ required: true, errorMessage: '请输入收货人姓名' }],
  },
  contact: {
    rules: [
      { required: true, errorMessage: '请输入手机号' },
      {
        pattern: '^1[3-9]\\d{9}$',
        errorMessage: '请输入正确的手机号',
      },
    ],
  },
  provinceCode: {
    rules: [{ required: true, errorMessage: '请选择地址' }],
  },
  address: {
    rules: [{ required: true, errorMessage: '请输入详细地址' }],
  },
}
// 提交
const submit = async () => {
  console.log(paramsData.value)
  await formRef.value.validate()
  if (query.id) {
    const res = await updateMemberAddressDetailAPI(query.id, paramsData.value)
    console.log(res)
  } else {
    const res = await addMemberAddressDetailAPI(paramsData.value)
    console.log(res)
  }
  uni.showToast({
    icon: 'success',
    title: '保存成功！',
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}
onLoad(() => {
  getMemberAddressDetail()
})
</script>

<template>
  <view class="changeAdress">
    <view class="card">
      <uni-forms ref="formRef" :model="paramsData" :rules="rules">
        <uni-forms-item name="receiver">
          <view class="item">
            <view class="left"> 收货人 </view>
            <view class="right">
              <input v-model="paramsData.receiver" type="text" placeholder="请输入收货人姓名" />
            </view>
          </view>
        </uni-forms-item>
        <uni-forms-item name="contact">
          <view class="item">
            <view class="left"> 手机号码 </view>
            <view class="right">
              <input v-model="paramsData.contact" type="text" placeholder="请输入手机号码" />
            </view>
          </view>
        </uni-forms-item>
        <uni-forms-item name="provinceCode">
          <view class="item">
            <view class="left"> 所在地区 </view>
            <view class="right">
              <picker
                mode="region"
                :value="[paramsData.provinceCode, paramsData.cityCode, paramsData.countyCode]"
                @change="onRegionChange"
              >
                <view>{{ fullLocationData || '请选择地址' }}</view>
              </picker>
            </view>
          </view>
        </uni-forms-item>
        <uni-forms-item name="address">
          <view class="item">
            <view class="left"> 详细地址 </view>
            <view class="right">
              <input v-model="paramsData.address" type="text" placeholder="请输入详细地址" />
            </view>
          </view>
        </uni-forms-item>
        <view class="item">
          <view class="left"> 是否为默认地址 </view>
          <view class="right">
            <switch
              :checked="paramsData.isDefault ? true : false"
              @change="onSwitchChange"
              color="#27ba9b"
              style="transform: scale(0.8); padding-left: 50rpx"
            />
          </view>
        </view>
      </uni-forms>
    </view>
    <view @click="submit" class="btn">保存并使用</view>
  </view>
</template>

<style lang="scss" scoped>
page {
  height: 100%;
}
.changeAdress {
  /* #ifdef H5 */
  height: 100%;
  /* #endif */
  /* #ifndef H5 */
  height: 100vh;
  /* #endif */
  background-color: #eee;
  overflow: hidden;
  .card {
    margin: 20rpx auto;
    width: 95vw;
    padding: 0 30rpx;
    background-color: #fff;
    border-radius: 15rpx;
    .uni-forms-item {
      margin-bottom: 0;
    }
    .item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eee;
      padding: 25rpx 0;
      &:last-child {
        border: none;
      }
      .left {
        width: 210rpx;
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
