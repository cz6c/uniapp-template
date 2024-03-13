import type { AddressItem } from './address'
import type { GoodsItem } from './global'

/** 商品信息 */
export type GoodsResult = {
  /** id */
  id: string
  /** 商品名称 */
  name: string
  /** 商品描述 */
  desc: string
  /** 当前价格 */
  price: number
  /** 原价 */
  oldPrice: number
  /** 主图图片集合[ 主图图片链接 ] */
  mainPictures: string[]
  /** 第一张主图片 */
  picture: string
  /** 商品属性集合[ 属性信息 ] */
  properties: DetailsPropertyItem[]
  /** 商品详情图片集合[ 图片链接 ] */
  pictures: string[]
  /** sku集合[ sku信息 ] */
  skus: SkuItem[]
  /** 可选规格集合备注[ 可选规格信息 ] */
  specs: SpecItem[]
  /** 用户地址列表[ 地址信息 ] */
  userAddresses: AddressItem[]
  /** 同类商品[ 商品信息 ] */
  similarProducts: GoodsItem[]
}

/** 属性信息 */
export type DetailsPropertyItem = {
  /** 属性名称 */
  name: string
  /** 属性值 */
  value: string
}

/** sku信息 */
export type SkuItem = {
  /** sku id */
  id: string
  /** sku 库存 */
  inventory: number
  /** sku 原价 */
  oldPrice: number
  /** sku 图片 */
  picture: string
  /** sku 当前价 */
  price: number
  /** sku 编码 */
  skuCode: string
  /** 规格集合[ 规格信息 ] */
  specVals: string[]
  specs: string[]
}

/** 可选规格信息 */
export type SpecItem = {
  /** 规格名称 */
  name: string
  /** 可选值集合[ 可选值信息 ] */
  options: string[]
}
