import type { PagesRequest, PagesResult } from '@/types/global'
import type { BannerList, CategoryList, GuessList, HotList } from '@/types/home'
import { http } from '@/utils/request'

// 获取轮播图
export const getBannerAPI = () => {
  return http<BannerList[]>({
    url: 'http://localhost:3000/cyx/v1/banner',
  })
}
// 获取分类
export const getHomeCategoryAPI = () => {
  return http<CategoryList[]>({
    url: 'http://localhost:3000/cyx/v1/categories/navs',
  })
}
// 获取热门推荐
export const getHomeHotAPI = () => {
  return http<HotList[]>({
    url: 'http://localhost:3000/cyx/v1/recommend/list',
  })
}

// 获取猜你喜欢数据
export const getGuessAPI = (data: PagesRequest) => {
  return http<PagesResult<GuessList[]>>({
    url: 'http://localhost:3000/cyx/v1/products/guessLike',
    data,
  })
}
