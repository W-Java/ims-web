import { get, post, put, deletefn } from './index'

//检查是否已经登录
export const checkLogin = () => post("/13/live")

//获取图片验证码
export const getVerificationCode = () => post("/13/captchaImage")

//账密登录
export const submitLogin = data => post("/13/login", data)

//重置密码
export const resetPassWord=data => post("/13/user/doResetPassword", data)
