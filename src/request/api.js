import http from './http'
//登录
export const checkMobile = p => http.post('/base/checkMobile',p) 
//列表
export const czModeList = p => http.post('/base/czModeList',p) 
//汇率
export const exchangeList = p => http.post('/base/exchangeList',p) 
//充值
export const addMoney = p => http.post('/base/addMoney',p) 

