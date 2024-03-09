import type { LoginResult } from '@/types/member'
import { http } from '@/utils/http'

type LoginWxMinParams = {
  code: string
  encryptedData?: string
  iv?: string
}
/**
 * 小程序登录
 * @param data 请求参数
 */
export const postLoginWxMinAPI = (data: LoginWxMinParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin',
    data,
  })
}

type LoginParams = {
  username: string
  password: string
}
/**
 * 传统登录-用户名+密码
 * @param data 请求参数
 */
export const postLoginAPI = (data: LoginParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/app/memberLogin',
    data,
  })
}
