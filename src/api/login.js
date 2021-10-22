import { get, post, put, deletefn } from './index'

//检查是否已经登录
export const checkLogin = () => post("/sm/live")

//获取图片验证码
export const getVerificationCode = () => post("/sm/verify")

//账密登录
export const submitLogin = data => post("/sm/login", data)

//重置密码
export const resetPassWord=data => post("/sm/user/doResetPassword", data)
