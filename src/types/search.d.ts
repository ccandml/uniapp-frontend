import { GuessList } from './home'
/**
 * 接口请求参数类型
 * 说明：所有参数均为可选
 */
export type SearchParams = {
  /** 页码 */
  page?: number
  /** 页尺寸 */
  pageSize?: number
  /** 所输入的关键词 */
  keyword?: string
}
export type SearchList = GuessList
