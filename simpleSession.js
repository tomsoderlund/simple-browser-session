/**
 * SimpleSession module
 * @description Library to get/set session values from cookie and/or URL query string.
 * @module SimpleSession
 * @author Tom Söderlund
 */

const DEFAULT_COOKIE_NAME = 'app'
let cookieName = DEFAULT_COOKIE_NAME

const queryObjectFromString = (url, useHash = false) => (url.split(useHash ? '#' : '?')[1] || '')
  .split('&')
  .reduce((result, propValue) => {
    if (propValue !== '') result[propValue.split('=')[0]] = parseObject(decodeURIComponent(propValue.split('=')[1]))
    return result
  }, {})

const queryObjectToString = (queryObject, useHash = false) => Object.keys(queryObject).reduce((result, key) => (queryObject[key] === undefined) ? result : result + (result.length ? '&' : (useHash ? '#' : '?')) + key + '=' + queryObject[key], '')

const getCookies = () => window.document.cookie.split('; ').reduce((result, str) => {
  const keyValue = str.split('=')
  result[keyValue[0]] = keyValue[1]
  return result
}, {})

const getCookie = (name) => getCookies()[name]

const setCookie = (name, value) => {
  window.document.cookie = `${name}=${value}`
}

const parseObject = obj => (typeof (obj) === 'string' && (obj.includes('{') || obj.includes('['))) ? JSON.parse(obj) : obj

const getCurrentValues = (options) => {
  const getValue = options.useCookies ? getCookie : window.localStorage.getItem
  const cookie = parseObject(getValue(name))
  const query = queryObjectFromString(window.location.href, options.useHash)
  return Object.assign({}, cookie, query)
}

// Public API

export const getSessionValue = function (property, defaultValue, options = {}) {
  if (options.cookieName) cookieName = options.cookieName
  const value = getCurrentValues(options)[property]
  return value !== undefined ? value : defaultValue
}

export const setSessionValue = function (property, value, options = {}) {
  options.updateStored = options.updateStored || true
  options.updatePath = options.updatePath || false
  const setValue = options.useCookies ? setCookie : window.localStorage.setItem
  if (options.cookieName) cookieName = options.cookieName
  if (options.updateStored) {
    setValue(cookieName, JSON.stringify({ [property]: value }))
  }
  if (options.updatePath) {
    const query = queryObjectFromString(window.location.href, options.useHash)
    const newPath = queryObjectToString(Object.assign({}, query, { [property]: JSON.stringify(value) }), options.useHash)
    window.history.pushState(null, null, newPath)
  }
}
