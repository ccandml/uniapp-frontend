import type { HotPanelData, HotRquest } from '@/pages/types/hot'
import { http } from '@/utils/request'
// 四个请求
export const getHotDetailAPI = (url: string, data?: HotRquest) => {
  return http<HotPanelData>({
    url,
    data,
  })
}
