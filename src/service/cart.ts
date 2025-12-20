import type { CartItem } from '@/types/cart'
import { http } from '@/utils/request'
// 添加购物车
export const addCartAPI = (data: { skuId: string; count: number }) => {
  return http({
    url: '/member/cart',
    method: 'POST',
    data,
  })
}
// 获取购物车
export const getCartAPI = () => {
  return http<CartItem[]>({
    url: '/member/cart',
    method: 'GET',
  })
}
// 修改数量
export const addCartCountAPI = (skuId: string, data: { selected: boolean; count: number }) => {
  return http<CartItem>({
    url: `/member/cart/${skuId}`,
    method: 'PUT',
    data,
  })
}
// 全选
export const selectedAllCartAPI = (selected: boolean) => {
  return http({
    url: `/member/cart/selected`,
    method: 'PUT',
    data: {
      selected,
    },
  })
}
// 删除购物车
export const delCartAPI = (skuId: string[]) => {
  return http({
    url: `/member/cart`,
    method: 'DELETE',
    data: { ids: skuId },
  })
}
