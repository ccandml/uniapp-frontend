import XtxGuess from '@/components/XtxGuess.vue'
import XtxBanner from '@/components/XtxBanner.vue'
import type CategoryPanel from '../index/components/CategoryPanel.vue'
import type HotPanel from '../index/components/HotPanel.vue'
// 拿到的是一个实例类型
/* 1.组件文件默认导出的是 构造函数(带值)
↓
2.typeof 组件 → 拿到这个构造函数类型（类型）
↓
3.InstanceType<构造函数类型> → 得到实例类型（含 $props / $emit / 你暴露的方法）
↓
4.把实例类型赋给 ref 或 props → 模板/代码里就能智能提示+类型检查 */
export type XtxBannerInstance = InstanceType<typeof XtxBanner>
export type CategoryPanelInstance = InstanceType<typeof CategoryPanel>
export type HotPanelInstance = InstanceType<typeof HotPanel>
export type XtxGuessInstance = InstanceType<typeof XtxGuess>
