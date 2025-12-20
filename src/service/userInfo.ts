import type { ProfileDetail, RequestProfile } from '@/types/member'
import { http } from '@/utils/request'
// 获取信息
export const getUserInfoAPI = () => {
  return http<ProfileDetail>({
    url: '/member/profile',
  })
}
// 更新数据
export const updateUserInfoAPI = (data: RequestProfile) => {
  return http<ProfileDetail>({
    url: '/member/profile',
    method: 'PUT',
    data,
  })
}
// 头像上传H5端(小程序用uni.upload)
export const uploadImgAPI = (data: FormData) => {
  return http({
    url: '/member/profile/avatar',
    method: 'POST',
    data,
  })
}
