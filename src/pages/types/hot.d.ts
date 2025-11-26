import type { GoodsItems, PagesRequest, PagesResult } from './global'

// 发送请求类型
export type HotRquest = { subType?: string } & PagesRequest

// 接收数据类型
export type HotPanelData = {
  title: string
  id: string
  bannerPicture: string
  subTypes: {
    id: string
    title: string
    goodsItems: PagesResult<GoodsItems[]>
  }[]
}
