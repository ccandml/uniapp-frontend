export type UserBase = {
  /** 用户ID */
  id: number
  /** 头像  */
  avatar: string
  /** 昵称 */
  username: string
}

/** pinia的用户类型 */
export type MemberData = UserBase & {
  /** 登录凭证 */
  access_token: string
}

/** 个人信息 用户详情信息 */
export type ProfileDetail = UserBase & {
  /** 性别 */
  gender?: Gender
  /** 生日 */
  birthday?: string
  /** 省市区 */
  fullLocation?: string
  /** 地区编码（单编码） */
  locationCode?: string
  /** 职业 */
  profession?: string
}
/** 性别 */
export type Gender = '女' | '男' | '未知'

// 请求参数类型
export type RequestProfile = Pick<
  ProfileDetail,
  'username' | 'gender' | 'birthday' | 'profession' | 'fullLocation'
>

// 用户资料更新请求体，支持局部更新（如仅更新头像）
export type RequestUpdateProfile = Partial<RequestProfile & Pick<ProfileDetail, 'avatar'>>
