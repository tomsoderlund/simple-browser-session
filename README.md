# simple-session

Library to get/set session values from cookie and/or URL query string.

Get a value:

	getSessionValue(property, defaultValue, options = { useHash = false, cookieName = 'app' })

Set a value:

	setSessionValue(property, value, options = { updateCookie = true, updateQuery = false, useHash = false, cookieName = 'app' })
