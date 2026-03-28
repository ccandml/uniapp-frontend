import { http } from '@/utils/request'

export interface RegisterPayload {
  username: string
  password: string
}

export const registerAPI = (data: RegisterPayload) => {
  return http({
    method: 'POST',
    url: '/auth/signup',
    data,
  })
}
