<script setup lang="ts">
import { computed } from 'vue'

// modelValue: 控制显隐；content: 公告正文；title/confirmText 支持外部覆盖。
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    content: string
    confirmText?: string
  }>(),
  {
    title: '系统公告',
    confirmText: '我已知晓',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

// 约定后端在公告末尾返回 "---署名"，这里拆分为正文和右对齐署名。
const parsedNotice = computed(() => {
  const text = (props.content || '').trim()
  const match = text.match(/---\s*([^\n\r]+)\s*$/)
  if (!match) {
    return {
      body: text,
      signature: '',
    }
  }

  const signatureStart = match.index ?? text.lastIndexOf(match[0])
  const body = text.slice(0, signatureStart).trim()
  const signatureText = match[1]?.trim() || ''
  const signature = signatureText ? `---${signatureText}` : ''
  return {
    body,
    signature,
  }
})

const onConfirm = () => {
  // 先向外抛出确认事件，再关闭弹窗，便于父组件按需做埋点或额外处理。
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<template>
  <view v-if="props.modelValue" class="notice-popup">
    <view class="mask"></view>
    <view class="panel">
      <view class="title">{{ props.title }}</view>
      <scroll-view class="content" scroll-y>
        <text class="content-text">{{ parsedNotice.body }}</text>
        <text v-if="parsedNotice.signature" class="signature">{{ parsedNotice.signature }}</text>
      </scroll-view>
      <button class="confirm-btn" @click="onConfirm">{{ props.confirmText }}</button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.notice-popup {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
}

.panel {
  position: relative;
  width: 80vw;
  max-height: 70vh;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx 40rpx 45rpx;
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.22);
  animation: popup-in 620ms ease;
}

.title {
  text-align: center;
  font-size: 34rpx;
  font-weight: 600;
  color: #222;
  margin-bottom: 20rpx;
}

.content {
  max-height: 45vh;
  margin-bottom: 24rpx;
}

.content-text {
  display: block;
  color: #333;
  font-size: 28rpx;
  line-height: 1.65;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-all;
}

.signature {
  display: block;
  margin-top: 24rpx;
  color: #666;
  font-size: 26rpx;
  text-align: right;
}

.confirm-btn {
  width: 100%;
  height: 76rpx;
  line-height: 76rpx;
  border-radius: 40rpx;
  border: 0;
  background: $theme-color;
  color: #fff;
  font-size: 30rpx;
}

.confirm-btn::after {
  border: none;
}

@keyframes popup-in {
  0% {
    opacity: 0;
    transform: translateY(14rpx) scale(0.66);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
