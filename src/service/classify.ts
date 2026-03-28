import type { ClassifyData } from '@/types/classify'
import { http } from '@/utils/request'

export const getClassifyAPI = () => {
  return http<ClassifyData[]>({
    url: '/categories',
  })
}
