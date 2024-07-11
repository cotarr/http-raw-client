# http-raw-client

For debugging, send one raw http request.

- This is a simple ad-hoc tool that may be useful for web server testing.
- It operates similar to using a telnet client to test a web server.
- This tool was written to send one raw http request without character escaping or other encoding.
- The http response is sent to stdout.
- Both http and https (TLS) are supported.
- It it a JavaScript program intended to run in NodeJs using command line terminal.
- There are no dependencies and no npm modules are required.


## Install

```bash
git clone git@github.com:cotarr/http-raw-client.git
cd http-raw-client
```

Do not run `npm install`. There are no NPM dependencies. The repository does not include a package.json file.

## Configure

This is a simple ad-hoc test program. The intent is to modify app.js 
for each test, and re-run the http client (`node app.js`) to view each new test.

1) In the `app.js`, set the host, port and set tls=true/false

```js
let options = {
  port: 443,
  host: 'www.example.com',
  tls: true,
  verifyTlsHost: true
}
```

2) In the `app.js`, setup an array of stings containing the http request.
The end of line '\r\n' will be appended automatically.
Additional headers may be added as necessary for cookies or tokens.
The request will be completed automatically by automatically
appending an empty line to the request.

```js
const outputText = [
  'GET / HTTP/1.1',
  'Host: ' + options.host + appendPortToHost,
  'User-Agent: custom-user-agent-for-testing',
];
```

## To run

To run, type: `node app.js`

Example output:

```bash
user1@laptop:~/dev/http-raw-client$ node app.js
Event: connect
Event: ready
tls.Connect callback
Event: secureConnect
socket.authorized  true
socket.authorizationError  null
Write:  GET / HTTP/1.1
Write:  Host: www.example.com
Write:  User-Agent: custom-user-agent-for-testing
Close HTTP request by sending final EOL: \r\n)

Event: data

HTTP/1.1 200 OK
X-Powered-By: Express
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Mon, 21 Nov 2022 01:21:56 GMT
ETag: W/"123-12345c67890"
Content-Type: text/html; charset=UTF-8
Content-Length: 807
Date: Mon, 21 Nov 2022 01:23:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5


<html>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>

user1@laptop:~/dev/http-raw-client$ node app.js
```

## Credentials from environment variables

Credentials such as a cookies and access tokens that 
may be available as environment variables. 
These can be used within the http request using the 
process.env API available in nodejs.
This would avoid hard coded credentials.

Authorization headers will be created automatically when
unix environment variables COOKIE or TOKEN are found.
These can be crated from the CLI

```bash
export COOKIE=xxxxxxxxxx

export TOKEN=yyyyyyyyyy
```
This will automatically add the following headers:

```
Cookie: xxxxxxxxxx
Authorization: Bearer yyyyyyyyyy
```

Alternately, these can be added manually in the outputText Array.

```
const outputText = [
  'GET / HTTP/1.1',
  'Host: ' + options.host + appendPortToHost,
  'User-Agent: custom-user-agent-for-testing',
  'Cookie: www.example.com=' + process.env.COOKIE,
];
```

Reference access token from env variables

```
const outputText = [
  'GET / HTTP/1.1',
  'Host: ' + options.host + appendPortToHost,
  'User-Agent: custom-user-agent-for-testing',
  'Authorization: Bearer ' + process.env.TOKEN,
];
```