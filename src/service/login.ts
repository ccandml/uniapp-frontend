import type { MemberData } from '@/types/member'
import { http } from '@/utils/request'

// h5 账号密码登录
interface stringData {
  username: string
  password: string
}
export const stringLoginAPI = (stringData: stringData) => {
  return http<MemberData>({
    method: 'POST',
    url: '/auth/signin',
    data: stringData,
  })
}

// 小程序快捷登录
export const wechatLoginAPI = (data: { code: string }) => {
  return http<MemberData>({
    method: 'POST',
    url: '/auth/wechat-signin',
    data,
  })
}

// 测试登录
export const buildLoginAPI = () => {
  return http<MemberData>({
    method: 'POST',
    url: '/auth/signin',
    data: { username: '普通用户1', password: '123123' },
  })
}
