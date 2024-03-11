import type { CartItem } from '@/types/cart'
import { http } from '@/utils/http'
/**
 * 加入购物车
 * @param data 请求体参数
 */
export const postMemberCartAPI = (data: { skuId: string; count: number }) => {
  return http({
    method: 'POST',
    url: '/app/cart/create',
    data,
  })
}

/**
 * 获取购物车列表
 */
export const getMemberCartAPI = () => {
  return http<{ list: CartItem[] }>({
    method: 'GET',
    url: '/app/cart/list',
  })
}

/**
 * 删除/清空购物车单品
 * @param data 请求体参数 ids SKUID 集合
 */
export const deleteMemberCartAPI = (data: { ids: string[] }) => {
  return http({
    method: 'POST',
    url: '/app/cart/delete',
    data,
  })
}

/**
 * 修改购物车单品
 * @param data skuId SKUID selected 选中状态 count 商品数量
 */
export const postMemberCartBySkuIdAPI = (data: {
  id: string
  skuId?: string
  selected?: boolean
  count?: number
}) => {
  return http({
    method: 'POST',
    url: `/app/cart/update`,
    data,
  })
}

/**
 * 购物车全选/取消全选
 * @param data selected 是否选中
 */
export const postMemberCartSelectedAPI = (data: { selected: boolean }) => {
  return http({
    method: 'POST',
    url: '/app/cart/selected',
    data,
  })
}
