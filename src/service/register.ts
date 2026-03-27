import { http } from '@/utils/request'

export interface RegisterPayload {
  username: string
  password: string
}

export const registerAPI = (data: RegisterPayload) => {
  return http({
    method: 'POST',
    url: 'http://localhost:3000/cyx/v1/auth/signup',
    data,
  })
}
