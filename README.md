jog-stdstore
============

Provides StdStore for [jog](https://github.com/visionmedia/jog).

[![build status](https://secure.travis-ci.org/cpsubrian/node-jog-stdstore.png)](http://travis-ci.org/cpsubrian/node-jog-stdstore)

Usage
-----

```js
var StdStore = require('jog-stdstore')
  , jog = require('jog')
  , log = jog(new StdStore());

log.info('something cool', {name: 'Cool thing'});

// Logging output sent to stdout and stderr
```

Options
-------

An options hash can be passed to the StdStore constructor with the following
keys:

- `inStream` - A readable stream (defaults to `process.stdin`).
- `errStream` - A writable stream for 'error' and 'warn' level logs. (defaults
                to `process.stderr`).
- `outStream` - A writable stream for 'info' and 'debug' level logs. (defaults
                to `process.stdout`).
- `redirect` - Send all output to the *outStream*, instead of *out* and *err*.

Using with the joli(1)
----------------------

After configuring your app to log via the StdStore, all your logging output
will be in the console, but it will be full JSON objects.

To make some sense of your logs I recommend checking out [joli](https://github.com/cpsubrian/node-joli).

**Example**

Normal output ...

```
$ node myapp.js
{type: "user authenticated", uid: 24, timestamp: 1234789091823}
{type: "user authenticated", uid: 14, timestamp: 1234789091823}
{type: "request", path: "/", timestamp: 1234789091823}
{type: "request", path: "/about", timestamp: 1234789091823}
{type: "query", query: "SELECT * FROM fun", timestamp: 1234789091823}
{type: "request", path: "/", timestamp: 1234789091823}
{type: "query", query: "DELETE * FROM users", timestamp: 1234789091823}
{type: "user authenticated", uid: 500, timestamp: 1234789091823}
```

Using joli ...

```
$ node myapp.js 2>&1 | joli -l --map type
user authenticated
user authenticated
request
request
query
request
query
user authenticated
```

Or ...

```
$ node myapp.js 2>&1 | joli -l --map "'Request: ' + _.path" --filter "_.type === 'request'"
Request: /
Request: /about
Request: /
```

**Joli** Exposes a similar CLI to jog(1) but with support for reading from
stdin as well as using saved 'styles' and 'outputters'.

- - -

### Developed by [Terra Eclipse](http://www.terraeclipse.com)
Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Aptos, CA and Washington, D.C.

- - -

### License: MIT
Copyright (C) 2012 Terra Eclipse, Inc. ([http://www.terraeclipse.com](http://www.terraeclipse.com))

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
