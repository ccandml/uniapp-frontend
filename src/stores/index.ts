import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

// 默认导出给main.ts
export default pinia

// 导出全部模块
export * from './modules/member'
export * from './modules/history'
export * from './modules/address'
