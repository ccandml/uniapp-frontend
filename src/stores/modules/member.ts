import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMemberStore = defineStore(
  'member',
  () => {
    //   会员信息
    const profile = ref<any>()
    //   保存会员信息
    const setProfile = (val: any) => {
      profile.value = val
    }
    //   清理会员信息
    const clearProfile = () => {
      profile.value = undefined
    }
    return {
      profile,
      setProfile,
      clearProfile,
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
