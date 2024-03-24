import type { ProfileDetail, ProfileParams } from '@/types/member'
import { http } from '@/utils/http'

/**
 * 获取个人信息
 */
export const getMemberProfileAPI = () => {
  return http<ProfileDetail>({
    method: 'GET',
    url: '/member/info',
  })
}

/**
 * 修改个人信息
 * @param data 请求体参数
 */
export const updateMemberProfileAPI = (data: ProfileParams) => {
  return http<ProfileDetail>({
    method: 'POST',
    url: '/member/update',
    data,
  })
}
