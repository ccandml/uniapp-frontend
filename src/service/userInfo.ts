import type { ProfileDetail, RequestUpdateProfile } from '@/types/member'
import { http } from '@/utils/request'
// 获取信息
export const getUserInfoAPI = () => {
  return http<ProfileDetail>({
    url: 'http://localhost:3000/cyx/v1/user/profile',
  })
}
// 更新数据
export const updateUserInfoAPI = (data: RequestUpdateProfile) => {
  return http<ProfileDetail>({
    url: 'http://localhost:3000/cyx/v1/user/profile',
    method: 'PUT',
    data,
  })
}
