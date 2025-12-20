import type {
  OrderCreateParams,
  OrderListParams,
  OrderListResult,
  OrderLogisticResult,
  OrderPreResult,
  OrderResult,
} from '@/types/order'
import { http } from '@/utils/request'

// 获取预付订单
export const getOrderPreAPI = () => {
  return http<OrderPreResult>({
    url: '/member/order/pre',
  })
}
// 获取立即购买订单
export const getOrderNowAPI = (data: { skuId: string; count: string; addressId: string }) => {
  return http<OrderPreResult>({
    url: '/member/order/pre/now',
    data,
  })
}
// 提交订单
export const submiteOrderAPI = (data: OrderCreateParams) => {
  return http<{ id: string }>({
    method: 'POST',
    url: '/member/order',
    data,
  })
}
// 获取订单详情
export const getOrderDetailAPI = (id: string) => {
  return http<OrderResult>({
    url: `/member/order/${id}`,
  })
}

// 模拟支付
export const payAPI = (orderId: string) => {
  return http({
    url: '/pay/mock',
    data: {
      orderId,
    },
  })
}

// 模拟发货
export const transportAPI = (id: string) => {
  return http({
    url: `/member/order/consignment/${id}`,
  })
}

// 获取物流信息
export const getTransportDetailAPI = (id: string) => {
  return http<OrderLogisticResult>({
    url: `/member/order/${id}/logistics`,
  })
}

// 确认收货
export const collectTransportAPI = (id: string) => {
  return http({
    url: `/member/order/${id}/receipt`,
    method: 'PUT',
  })
}
// 删除订单
export const delOrderAPI = (id: string) => {
  return http({
    url: `/member/order`,
    method: 'DELETE',
    data: {
      ids: [id],
    },
  })
}

// 获取订单列表
export const getOrderListAPI = (data: OrderListParams) => {
  return http<OrderListResult>({
    url: `/member/order`,
    data,
  })
}
