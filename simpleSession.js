/**
 * SimpleSession module
 * @description Library to get/set session values from cookie and/or URL query string.
 * @module SimpleSession
 * @author Tom Söderlund
 */

const DEFAULT_COOKIE_NAME = 'app'
let cookieName = DEFAULT_COOKIE_NAME

const stringifyObject = obj => typeof obj === 'object' ? JSON.stringify(obj) : obj.toString()

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

const getCookie = () => parseObject(getCookies()[cookieName])

const getCookieItem = (property) => getCookie()[property]

const setCookieItem = (property, value) => {
  const mergedCookie = Object.assign({}, getCookie(), { [property]: value })
  const cookieString = stringifyObject(mergedCookie)
  window.document.cookie = `${cookieName}=${cookieString}`
}

const parseObject = obj => (typeof (obj) === 'string' && (obj.includes('{') || obj.includes('['))) ? JSON.parse(obj) : obj

// Public API

module.exports.getSessionValue = function (property, defaultValue, options = {}) {
  if (options.cookieName) cookieName = options.cookieName
  const storedValue = parseObject(options.useCookies ? getCookieItem(property) : window.localStorage.getItem(property))
  const queryValues = queryObjectFromString(window.location.href, options.useHash)
  const value = queryValues[property] || storedValue
  return value !== undefined ? value : defaultValue
}

module.exports.setSessionValue = function (property, value, options = {}) {
  options.updateStored = options.updateStored || true
  options.updatePath = options.updatePath || false
  if (options.cookieName) cookieName = options.cookieName
  if (options.updateStored) {
    options.useCookies
      ? setCookieItem(property, stringifyObject(value))
      : window.localStorage.setItem(property, stringifyObject(value))
  }
  if (options.updatePath) {
    const query = queryObjectFromString(window.location.href, options.useHash)
    const newPath = queryObjectToString(Object.assign({}, query, { [property]: stringifyObject(value) }), options.useHash)
    window.history.pushState(null, null, newPath)
  }
}
