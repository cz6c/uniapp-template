import type { SkuItem } from '@/types/goods'

// 按钮模式 1:显示购物车+立即购买 2:购物车 3:立即购买 4:确认按钮 5:缺货按钮
export enum SkuMode {
  CartAndCart = 1,
  Cart = 2,
  Buy = 3,
  Sure = 4,
  NoStock = 5,
}

/** 当前选择的sku数据 */
export type SkuPopupEvent = SkuItem & {
  /** 商品购买数量 */
  buyNum: number
}
