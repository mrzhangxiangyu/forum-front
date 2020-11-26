import Cookies from 'js-cookie'

export function setAdminLogin(adminLogin) {
  return Cookies.set('adminLogin', adminLogin)
}

export function getAdminLogin() {
  return Cookies.get('adminLogin')
}

export function setUserLogin(userLogin) {
  return Cookies.set('userLogin', userLogin)
}

export function getUserLogin() {
  return Cookies.get('userLogin')
}

export function setUserId(userId) {
  return Cookies.set('userId', userId)
}

export function getUserId() {
  return Cookies.get('userId')
}
