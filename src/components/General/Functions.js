


export function logout() {
  localStorage.setItem('token', '')
  localStorage.setItem('password', '')
  localStorage.setItem('key', '')
  localStorage.setItem('currency', '')
  window.location.href = '/'
}

export function isLoggedIn() {
  if (localStorage.getItem('token') && localStorage.getItem('token') !== '') {
    return true
  } else {
    return false
  }
}

export function getWindowSize() {
  let windowSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  // window.addEventListener("resize", getWindowSize);

  return windowSize
}

export function loginLocalStorage(token, key, password,currency) {
  localStorage.setItem('token', token)
  localStorage.setItem('key', key)
  localStorage.setItem('password', password)
  localStorage.setItem('currency', currency)
}

