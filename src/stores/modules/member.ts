import type { MemberData } from '@/types/member'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMemberStore = defineStore(
  'member',
  () => {
    //   会员信息
    const profile = ref<MemberData>()
    //   保存会员信息
    const setProfile = (val: MemberData) => {
      profile.value = val
      profile.value.username = val.username
      profile.value.avatar = val.avatar
    }

    const setUsername = (username: string) => {
      if (profile.value) {
        profile.value.username = username
      }
    }

    const setAvatar = (avatar: string) => {
      if (profile.value) {
        profile.value.avatar = avatar
      }
    }

    //   清理会员信息
    const clearProfile = () => {
      profile.value = undefined
    }
    return {
      profile,
      setProfile,
      setUsername,
      setAvatar,
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
