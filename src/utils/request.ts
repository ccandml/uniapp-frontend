import { useMemberStore } from '@/stores'

const BASE_URL = 'https://cyx-0sar.onrender.com/cyx/v1'
const httpInterceptor = {
  // 请求前拦截
  invoke(options: UniApp.RequestOptions) {
    // 如果不是http开头就加上基地址
    if (!options.url.startsWith('http')) {
      options.url = BASE_URL + options.url
    }
    // 2. 请求超时
    options.timeout = 555000
    // 3. 添加小程序端请求头标识
    options.header = {
      'source-client': 'miniapp',
      ...(options.header || {}),
    }
    // 4. 添加 token 请求头标识
    const memberStore = useMemberStore()
    const token = memberStore.profile?.access_token
    if (token) {
      options.header.Authorization = 'Bearer ' + token
    }

    console.log('最终请求地址:', options.url)
    console.log('最终请求头:', options.header)
  },
}

uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * 请求函数
 * @param  UniApp.RequestOptions
 * @returns Promise
 *  1. 返回 Promise 对象，用于处理返回值类型
 *  2. 获取数据成功
 *    2.1 提取核心数据 res.data
 *    2.2 添加类型，支持泛型
 *  3. 获取数据失败
 *    3.1 登录接口401 -> 提示账号或密码错误
 *    3.2 其他接口401 -> 清理用户信息，跳转到登录页
 *    3.3 其他错误 -> 根据后端错误信息轻提示
 *    3.4 网络错误 -> 提示用户换网络
 */
interface Data<T> {
  code: string
  message: string
  result: T
}

interface HttpRequestOptions extends UniApp.RequestOptions {
  // 允许调用方按需关闭全局 loading（默认开启）
  loading?: boolean
}

let loadingRequestCount = 0

const startGlobalLoading = () => {
  if (loadingRequestCount === 0) {
    uni.showLoading({
      title: '加载中...',
      // 开启遮罩，防止加载中误触页面交互
      mask: true,
    })
  }
  loadingRequestCount += 1
}

const stopGlobalLoading = () => {
  loadingRequestCount = Math.max(loadingRequestCount - 1, 0)
  if (loadingRequestCount === 0) {
    uni.hideLoading()
  }
}

// 登录接口返回 401 时，只提示账号密码错误，不做全局过期跳转。
const LOGIN_API_PATHS = ['/auth/signin', '/login/wxMin']

const isLoginRequest = (url = '') => {
  return LOGIN_API_PATHS.some((path) => url.includes(path))
}

export const http = <T>(options: HttpRequestOptions) => {
  return new Promise<Data<T>>((resolve, reject) => {
    const needLoading = options.loading !== false
    if (needLoading) {
      startGlobalLoading()
    }
    const requestUrl = options.url || ''
    uni.request({
      ...options,
      //  响应成功
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          if (isLoginRequest(requestUrl)) {
            uni.showToast({
              icon: 'none',
              title: '账号或密码错误',
            })
            reject(res)
            return
          }

          uni.showToast({
            icon: 'none',
            title: '登录已过期，请重新登录',
          })
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          const pages = getCurrentPages()
          const currentPage = pages[pages.length - 1] as {
            route?: string
            options?: Record<string, unknown>
          }
          const currentRoute = currentPage?.route
          if (currentRoute !== 'pages/login/login') {
            const path = `/${currentRoute}`
            const query = Object.entries(currentPage?.options || {})
              .map(
                ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
              )
              .join('&')
            const redirect = query ? `${path}?${query}` : path
            // 记录来源页，登录成功后可回跳；同时用 redirectTo 避免 401 时页面栈循环堆积
            uni.redirectTo({
              url: `/pages/login/login?redirect=${encodeURIComponent(redirect)}`,
            })
          }
          reject(res)
        } else {
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).message || '请求错误',
          })
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试~',
        })
        reject(err)
      },
      complete() {
        if (needLoading) {
          stopGlobalLoading()
        }
      },
    })
  })
}
