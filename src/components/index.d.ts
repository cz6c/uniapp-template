import XtxSwiper from '@/components/XtxSwiper.vue'
import XtxGuess from '@/components/XtxGuess.vue'
import SpecsSelectPopup from './SpecsSelectPopup/index.vue'

/** 全局组件类型声明 */
declare module 'vue' {
  export interface GlobalComponents {
    XtxSwiper: typeof XtxSwiper
    XtxGuess: typeof XtxGuess
    SpecsSelectPopup: typeof SpecsSelectPopup
  }
}

// 组件实例类型
export type XtxGuessInstance = InstanceType<typeof XtxGuess>
export type XtxSwiperInstance = InstanceType<typeof XtxSwiper>
/** SKU 弹出层实例 */
export type SkuPopupInstance = InstanceType<typeof SpecsSelectPopup>
