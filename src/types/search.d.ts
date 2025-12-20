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
  /** 联想词Id集合 */
  associatedIds?: string[]
  /** 分类id */
  categoryId?: string
  /** 品牌id */
  brandId?: string
  /** 只显示特惠 */
  onlyDiscount?: boolean
  /**
   * 排序字段
   * 取值范围：publishTime, orderNum, price, evaluateNum
   */
  sortField?: 'publishTime' | 'orderNum' | 'price' | 'evaluateNum'
  /**
   * 排序规则
   * asc为正序，desc为倒序，默认为desc
   */
  sortMethod?: 'asc' | 'desc'
}
