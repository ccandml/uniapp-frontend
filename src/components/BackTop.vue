<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    scrollTop?: number
    threshold?: number
    anchorId?: string
    right?: string
    bottom?: string
    zIndex?: number
  }>(),
  {
    scrollTop: 0,
    threshold: 320,
    anchorId: 'top-anchor',
    right: '28rpx',
    bottom: '220rpx',
    zIndex: 999,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 超过阈值后才展示按钮，避免页面初始时按钮干扰内容阅读。
const isVisible = computed(() => props.scrollTop >= props.threshold)

const onBackTop = () => {
  // 通过 scroll-into-view 跳到顶部锚点，随后立即复位，保证下次点击仍然生效。
  emit('update:modelValue', props.anchorId)
  setTimeout(() => {
    emit('update:modelValue', '')
  }, 0)
}
</script>

<template>
  <view
    class="back-top"
    :class="{ visible: isVisible }"
    :style="{ right: props.right, bottom: props.bottom, zIndex: String(props.zIndex) }"
    @click="onBackTop"
  >
    ↑
  </view>
</template>

<style scoped lang="scss">
.back-top {
  position: fixed;
  width: 78rpx;
  height: 78rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  color: #00bf9c;
  font-size: 38rpx;
  line-height: 78rpx;
  text-align: center;
  box-shadow: 0 8rpx 18rpx rgba(0, 0, 0, 0.18);
  opacity: 0;
  transform: translateY(14rpx) scale(0.92);
  pointer-events: none;
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.back-top.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}
</style>
