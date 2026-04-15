import type { PagesRequest, PagesResult } from '@/types/global'
import type { BannerList, CategoryList, GuessList, HotList } from '@/types/home'
import { http } from '@/utils/request'

// 获取轮播图
export const getBannerAPI = () => {
  return http<BannerList[]>({
    url: '/banner',
    // 首页有骨架屏，关闭全局遮罩避免阻塞页面交互
    loading: false,
  })
}
// 获取分类
export const getHomeCategoryAPI = () => {
  return http<CategoryList[]>({
    url: '/categories/navs',
    // 首页有骨架屏，关闭全局遮罩避免阻塞页面交互
    loading: false,
  })
}
// 获取热门推荐
export const getHomeHotAPI = () => {
  return http<HotList[]>({
    url: '/recommend/list',
    // 首页有骨架屏，关闭全局遮罩避免阻塞页面交互
    loading: false,
  })
}

// 获取猜你喜欢数据
export const getGuessAPI = (data: PagesRequest) => {
  return http<PagesResult<GuessList[]>>({
    url: '/products/guessLike',
    data,
    // 首页猜你喜欢区域使用组件内加载态，不需要全局遮罩
    loading: false,
  })
}

// 获取系统公告
export const getNoticeAPI = () => {
  return http<{ content: string }>({
    url: '/notice',
    loading: false,
  })
}
