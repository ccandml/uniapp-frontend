import type { GoodsResult } from '@/types/goodsDetail'
import { http } from '@/utils/request'

export const getGoodsDetailAPI = (id: string) => {
  return http<GoodsResult>({
    url: 'http://localhost:3000/cyx/v1/products/goodsDetail',
    data: {
      id,
    },
  })
}
