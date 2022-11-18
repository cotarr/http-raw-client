# http-raw-client

For debugging, send one raw HTTP request.

During testing, this tool was written to send raw HTTP requests 
without character escaping or other encoding.
The program will send one raw HTTP request.
The response is console.log() to stdout.

This is HTTP only and does not support SSL/TLS HTTPS requests.

### Install

```bash
git clone git@github.com:cotarr/http-raw-client.git
```

### Configure

In the `app.js`, set the host and port

```js
let options = {
  port: 8000,
  host: 'localhost'
}
```

In the `app.js`, setup an array of stings containing the HTTP request.
The end of line '\r\n' will be appended automatically.
The final line is an empty string to complete the headers.

```js
const outputText = [
  'GET / HTTP/1.1',
  'Host: localhost',
  'User-Agent: agent',
  ''
];
```

### To run

```bash
node app.js
```
