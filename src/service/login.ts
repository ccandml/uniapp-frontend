import type { MemberData } from '@/types/member'
import { http } from '@/utils/request'

// h5手机号，密码登录
interface numberData {
  account: string
  password: string
}
export const numberLoginAPI = (numberData: numberData) => {
  return http<MemberData>({
    method: 'POST',
    url: '/login',
    data: numberData,
  })
}

// 小程序快捷登录（要钱）
interface wxData {
  code: string
  encryptedData: string
  iv: string
}
export const wxLoginAPI = (wxData: wxData) => {
  return http<MemberData>({
    method: 'POST',
    url: '/login/wxMin',
    data: wxData,
  })
}

// 内测登录
export const buildLoginAPI = () => {
  return http<MemberData>({
    method: 'POST',
    url: '/login/wxMin/simple',
    data: {
      phoneNumber: '13558351712',
    },
  })
}
