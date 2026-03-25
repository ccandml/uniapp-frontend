// 首页轮播图类型
export type BannerList = {
  // 跳转链接
  hrefUrl: string
  // id
  id: string
  // 图片链接
  imgUrl: string
  // 跳转类型
  type: number
}

// 首页分类数据
export type CategoryList = {
  id: string
  name: string
  icon: string
}

// 首页热门推荐
export type HotList = {
  id: string
  alt: string
  pictures: string[]
  target: string
  title: string
  type: string
}

// 首页猜你喜欢
export type GuessList = {
  id: string
  name: string
  desc: string
  price: number
  picture: string
  discount: number
  /** 销量 */
  orderNum: number
}
