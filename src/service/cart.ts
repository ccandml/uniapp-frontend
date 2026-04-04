import type { CartItem } from '@/types/cart'
import { http } from '@/utils/request'
// 添加购物车
export const addCartAPI = (data: { skuId: string; count: number }) => {
  return http({
    url: '/cart-item',
    method: 'POST',
    data,
  })
}
// 获取购物车列表
export const getCartAPI = () => {
  return http<CartItem[]>({
    url: '/cart-item',
    method: 'GET',
    loading: false,
  })
}
// 修改购物车（选中、数量）
export const addCartCountAPI = (cartId: string, data: { selected: boolean; count: number }) => {
  return http<CartItem>({
    url: `/cart-item/${cartId}`,
    method: 'PUT',
    data,
  })
}
// 全选
export const selectedAllCartAPI = (selected: boolean) => {
  return http({
    url: `/cart-item/selected/all`,
    method: 'PUT',
    data: {
      selected,
    },
  })
}
// 删除购物车
export const delCartAPI = (cartId: string) => {
  return http({
    url: `/cart-item/${cartId}`,
    method: 'DELETE',
  })
}
