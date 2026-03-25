import type { HotPanelData, HotRquest } from '@/types/hot'
import { http } from '@/utils/request'
// 四个请求
export const getHotDetailAPI = (data?: HotRquest) => {
  return http<HotPanelData>({
    url: 'http://localhost:3000/cyx/v1/recommend/details',
    data,
  })
}
