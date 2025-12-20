import type { AddressItem, AddressParams } from '@/types/address'
import { http } from '@/utils/request'

// 获取收货地址列表
export const getMemberAddressAPI = () => {
  return http<AddressItem[]>({
    url: '/member/address',
  })
}
// 获取地址详情
export const getMemberAddressDetailAPI = (id: string) => {
  return http<AddressItem>({
    url: `/member/address/${id}`,
  })
}
// 修改地址
export const updateMemberAddressDetailAPI = (id: string, data: AddressParams) => {
  return http<AddressParams>({
    method: 'PUT',
    url: `/member/address/${id}`,
    data,
  })
}
// 增加收货地址
export const addMemberAddressDetailAPI = (data: AddressParams) => {
  return http<number>({
    method: 'POST',
    url: `/member/address/`,
    data,
  })
}
// 删除收货地址
export const delMemberAddressDetailAPI = (id: string) => {
  return http<string>({
    method: 'DELETE',
    url: `/member/address/${id}`,
  })
}
