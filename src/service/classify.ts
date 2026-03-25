import type { ClassifyData } from '@/types/classify'
import { http } from '@/utils/request'

export const getClassifyAPI = () => {
  return http<ClassifyData[]>({
    url: 'http://localhost:3000/cyx/v1/categories',
  })
}
