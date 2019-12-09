# simple-browser-session

Library to get/set session values from cookie and/or URL query string.

![simple-browser-session](docs/simple-browser-session_github_preview.jpg)


## How to use

  import { getSessionValue, setSessionValue } from 'simple-browser-session'

Get a value:

	getSessionValue(property, defaultValue, options = { useHash = false, cookieName = 'app' })

Set a value:

	setSessionValue(property, value, options = { updateCookie = true, updateQuery = false, useHash = false, cookieName = 'app' })


## How it works

simple-browser-session creates a cookie called `app` (this can be changed with the `cookieName` prop).

This cookie contains a (serialized) JSON object with all the values that you save with `setSessionValue`.

simple-browser-session uses both the URL query string (e.g. `?name=value`) and the cookie. Query strings have precedence over cookie.
