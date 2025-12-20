import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHistoryStore = defineStore(
  'history',
  () => {
    //   历史信息
    const history = ref<string[]>([])
    //   保存历史信息
    const setHistory = (val: string) => {
      // 除去空值
      if (!val?.trim()) return
      //   除去重复值
      const filterHistory = history.value.filter((item) => item !== val)
      history.value = [val, ...filterHistory]
      //   长度限制
      history.value = history.value.slice(0, 10)
    }
    //   清理历史信息
    const clearHistory = () => {
      history.value = []
    }
    return {
      history,
      setHistory,
      clearHistory,
    }
  },
  //   持久化
  {
    persist: {
      // 兼容，重写
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
