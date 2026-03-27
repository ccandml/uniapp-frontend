import type { MemberData } from '@/types/member'
import { http } from '@/utils/request'

// h5 账号，密码登录
interface stringData {
  username: string
  password: string
}
export const stringLoginAPI = (stringData: stringData) => {
  return http<MemberData>({
    method: 'POST',
    url: 'http://localhost:3000/cyx/v1/auth/signin',
    data: stringData,
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

// 测试登录
export const buildLoginAPI = () => {
  return http<MemberData>({
    method: 'POST',
    url: 'http://localhost:3000/cyx/v1/auth/signin',
    data: { username: '魔王熙', password: 'password123' },
  })
}
