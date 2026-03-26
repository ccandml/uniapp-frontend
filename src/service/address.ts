import type { AddressItem, AddressParams } from '@/types/address'
import { http } from '@/utils/request'

// 获取收货地址列表
export const getMemberAddressAPI = () => {
  return http<AddressItem[]>({
    url: 'http://localhost:3000/cyx/v1/user-address/list',
  })
}
// 获取地址详情
export const getMemberAddressDetailAPI = (id: string) => {
  return http<AddressItem>({
    url: `http://localhost:3000/cyx/v1/user-address/${id}`,
  })
}
// 修改地址
export const updateMemberAddressDetailAPI = (id: string, data: AddressParams) => {
  return http<AddressParams>({
    method: 'PUT',
    url: `http://localhost:3000/cyx/v1/user-address/${id}`,
    data,
  })
}
// 增加收货地址
export const addMemberAddressDetailAPI = (data: AddressParams) => {
  return http({
    method: 'POST',
    url: `http://localhost:3000/cyx/v1/user-address`,
    data,
  })
}
// 删除收货地址
export const delMemberAddressDetailAPI = (id: string) => {
  return http<string>({
    method: 'DELETE',
    url: `http://localhost:3000/cyx/v1/user-address/${id}`,
  })
}
