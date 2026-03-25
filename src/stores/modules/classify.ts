import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useClassifyStore = defineStore(
  'classify',
  () => {
    // 当前选中的一级分类 id（用于首页和分类页切换时恢复状态）
    const currentClassifyId = ref('')

    // 设置当前一级分类 id；会覆盖之前导航带入的 id
    const setCurrentClassifyId = (id: string) => {
      currentClassifyId.value = id
    }

    return {
      currentClassifyId,
      setCurrentClassifyId,
    }
  },
  {
    persist: {
      // 兼容 uni-app 环境存储
      storage: {
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
        getItem(key) {
          return uni.getStorageSync(key)
        },
      },
    },
  },
)
