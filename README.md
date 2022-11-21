# http-raw-client

For debugging, send one raw http request.

- This is a simple ad-hoc tool that may be useful for web server testing.
- It operates similar to using a telnet client to test a web server.
- This tool was written to send one raw http request without character escaping or other encoding.
- The http response is sent to stdout.
- Both http and https (TLS) are supported.
- It it a JavaScript program intended to run in NodeJs using command line terminal.
- There are no dependencies and no npm modules are required.


### Install

```bash
git clone git@github.com:cotarr/http-raw-client.git
```

### Configure

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
The final line is an empty string to complete the http request.

```js
const outputText = [
  'GET / HTTP/1.1',
  'Host: ' + options.host + appendPortToHost,
  'User-Agent: custom-user-agent-for-testing',
  ''
];
```

### To run

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
Write:  
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

