import type {
  LogisticItem,
  OrderCreateParams,
  OrderListParams,
  OrderListResult,
  OrderPreResult,
  OrderResult,
} from '@/types/order'
import { http } from '@/utils/request'

// 获取预付订单
export const getOrderPreAPI = () => {
  return http<OrderPreResult>({
    url: '/order/pre',
  })
}
// 获取立即购买订单
export const getOrderNowAPI = (data: { skuId: string; count: string; addressId?: string }) => {
  return http<OrderPreResult>({
    url: '/order/pre/now',
    method: 'POST',
    data,
  })
}
// 提交订单
export const submiteOrderAPI = (data: OrderCreateParams) => {
  return http<{ id: string }>({
    method: 'POST',
    url: '/order',
    data,
  })
}

// 获取订单列表
export const getOrderListAPI = (data: OrderListParams) => {
  return http<OrderListResult>({
    url: `/order`,
    data,
  })
}

// 获取订单详情
export const getOrderDetailAPI = (id: string) => {
  return http<OrderResult>({
    url: `/order/${id}`,
  })
}

// 模拟支付
export const payAPI = (orderId: string) => {
  return http({
    url: `/order/pay/${orderId}`,
    method: 'PUT',
  })
}

// 模拟发货
export const transportAPI = (id: string) => {
  return http({
    url: `/order/consign/${id}`,
    method: 'PUT',
  })
}

// 获取物流信息
export const getTransportDetailAPI = (id: string) => {
  return http<LogisticItem[]>({
    url: `/order/logistics/${id}`,
  })
}

// 确认收货
export const collectTransportAPI = (id: string) => {
  return http({
    url: `/order/receipt/${id}`,
    method: 'PUT',
  })
}
// 删除订单
export const delOrderAPI = (id: string) => {
  return http({
    url: `/order/${id}`,
    method: 'DELETE',
  })
}
