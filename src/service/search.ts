import type { SearchParams } from '@/types/search'
import { http } from '@/utils/request'

// 搜索
export const getSearchListAPI = (data: SearchParams) => {
  return http({
    url: '/search/all',
    method: 'POST',
    data,
    header: {
      'Content-Type': 'application/json',
    },
  })
}
