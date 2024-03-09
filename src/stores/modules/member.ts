import type { ProfileDetail } from '@/types/member'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getMemberProfileAPI } from '@/services/member'
import dayjs from 'dayjs'

// 定义 Store
export const useMemberStore = defineStore(
  'member',
  () => {
    // 会员信息
    const profile = ref<ProfileDetail>()
    // token
    const token = ref('')

    const setToken = (val: string) => {
      token.value = val
    }

    // 获取会员信息
    const getMemberProfileData = async () => {
      const { data } = await getMemberProfileAPI()
      profile.value = { ...data, birthday: dayjs(data.birthday).format('YYYY-MM-DD') }
    }

    // 清理会员信息，退出时使用
    const weblogout = () => {
      profile.value = undefined
    }

    // 记得 return
    return {
      profile,
      token,
      setToken,
      getMemberProfileData,
      weblogout,
    }
  },
  {
    // 网页端配置
    // persist: true,
    // 小程序端配置
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      },
    },
  },
)
