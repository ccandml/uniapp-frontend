import type { SearchList, SearchParams } from '@/types/search'
import type { PagesResult } from '@/types/global'
import { http } from '@/utils/request'

// 搜索
export const getSearchListAPI = (data: SearchParams) => {
  return http<PagesResult<SearchList[]>>({
    url: '/products/search',
    method: 'GET',
    data,
  })
}
