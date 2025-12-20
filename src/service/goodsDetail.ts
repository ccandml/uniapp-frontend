import type { GoodsResult } from '@/types/goodsDetail'
import { http } from '@/utils/request'

export const getGoodsDetailAPI = (id: string) => {
  return http<GoodsResult>({
    url: '/goods',
    data: {
      id,
    },
  })
}
