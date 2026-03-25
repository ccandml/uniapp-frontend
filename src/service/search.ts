import type { SearchParams } from '@/types/search'
import { http } from '@/utils/request'

// 搜索
export const getSearchListAPI = (data: SearchParams) => {
  return http({
    url: 'http://localhost:3000/cyx/v1/products/search',
    method: 'GET',
    data,
  })
}
