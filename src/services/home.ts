import type { PageParams, PageResult } from '@/types/global'
import type { BannerItem, CategoryItem, GuessItem } from '@/types/home'
import { http } from '@/utils/http'

/**
 * 首页-广告区域-小程序
 */
export const getHomeBannerAPI = () => {
  return http<{ list: BannerItem[] }>({
    method: 'GET',
    url: '/banner/list',
  })
}

/**
 * 首页-前台分类-小程序
 */
export const getHomeCategoryAPI = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: '/home/category/mutli',
  })
}

/**
 * 猜你喜欢-小程序
 */
export const getHomeGoodsGuessLikeAPI = (data?: PageParams) => {
  return http<PageResult<GuessItem>>({
    method: 'GET',
    url: '/product/list',
    data,
  })
}
