import type { PagesRequest, PagesResult } from '@/pages/types/global'
import type { BannerList, CategoryList, GuessList, HotList } from '@/pages/types/home'
import { http } from '@/utils/request'

// 获取轮播图
export const getBannerAPI = (distributionSite = 1) => {
  // distributionSite=1首页，distributionSite=2商品页
  return http<BannerList[]>({
    url: '/home/banner',
    data: {
      distributionSite,
    },
  })
}
// 获取分类
export const getHomeCategoryAPI = () => {
  return http<CategoryList[]>({
    url: '/home/category/mutli',
  })
}
// 获取热门推荐
export const getHomeHotAPI = () => {
  return http<HotList[]>({
    url: '/home/hot/mutli',
  })
}

// 获取猜你喜欢数据
export const getGuessAPI = (data: PagesRequest) => {
  return http<PagesResult<GuessList[]>>({
    url: '/home/goods/guessLike',
    data,
  })
}
