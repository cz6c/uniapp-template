import type { AddressItem, AddressParams } from '@/types/address'
import { http } from '@/utils/http'

/**
 * 添加收货地址
 * @param data 请求参数
 */
export const addMemberAddressAPI = (data: AddressParams) => {
  return http({
    method: 'POST',
    url: '/address/create',
    data,
  })
}

/**
 * 获取收货地址列表
 */
export const getMemberAddressAPI = () => {
  return http<{ list: AddressItem[] }>({
    method: 'GET',
    url: '/address/list',
  })
}

/**
 * 获取收货地址详情
 * @param id 地址id(路径参数)
 */
export const getMemberAddressByIdAPI = (id: string) => {
  return http<AddressItem>({
    method: 'GET',
    url: `/address/info`,
    data: { id },
  })
}

/**
 * 修改收货地址
 * @param data 表单数据(请求体参数)
 */
export const updateMemberAddressByIdAPI = (data: AddressParams & { id: string }) => {
  return http({
    method: 'POST',
    url: `/address/update`,
    data,
  })
}

/**
 * 删除收货地址
 * @param id 地址id(路径参数)
 */
export const deleteMemberAddressByIdAPI = (id: string) => {
  return http({
    method: 'POST',
    url: `/address/delete`,
    data: { id },
  })
}

/**
 * @description: 获取地区下拉数据
 */
export const getAreaTreesAPI = () => {
  return http<{ list: AddressItem[] }>({
    method: 'GET',
    url: '/api/area/trees',
  })
}
