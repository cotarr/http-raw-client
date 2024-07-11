// HTTP Raw Client
//
// NodeJs application to open TCP socket and
//    issue one raw HTTP request
//    for use in testing a web server.
//
// Before use:
// - Enter host, port, and tls=true/false into options object
// - Enter raw request into outputText array
//
// To Run: node app.js
// Response sent to stdout
// ------------------------------------------
'use strict';
const net = require('net');
const tls = require('tls');
const process = require('process');

// Variables
const sendIntervalMs = 10;
let messageIndex = 0;
let socketConnected = false;
let socketError = false;

// --------------------------------
//
//   1 of 2 SET THIS (options)
//
// Address, port, tls=true/false
// --------------------------------
const options = {
  port: 3003,
  host: 'localhost',
  tls: false,
  verifyTlsHost: true
};

if (options.tls) {
  options.servername = options.host;
  options.rejectUnauthorized = options.verifyTlsHost;
  options.minVersion = 'TLSv1.2';
}

// Optional: Case of self signed client certificate required by API
/*
if (options.tls) {
  options.key = fs.readFileSync('key.pem');
  options.cert = fs.readFileSync('cert.pem');
  options.ca = [ fs.readFileSync('ca.pem') ];
  options.checkServerIdentity = () => { return null; };
}
*/

let appendPortToHost = '';
if ((options.port !== 80) && (options.port !== 443)) {
  appendPortToHost = ':' + options.port.toString();
}

// ----------------------------------------------
//
//    2 of 2 SET THIS (outputText)
//
// Array of strings to be sent to the web server.
// The \r\n is appended automatically
// Note empty string at the end.
// ----------------------------------------------
const outputText = [
  'GET /status HTTP/1.1',
  'Host: ' + options.host + appendPortToHost,
  'User-Agent: custom-user-agent-for-testing'
];
// Authorization headers from environment variables
if (process.env.COOKIE) {
  outputText.push('Cookie: ' + process.env.COOKIE);
}
if (process.env.TOKEN) {
  outputText.push('Authorization: Bearer ' + process.env.TOKEN);
}

let socket = null;

if (options.tls) {
  socket = tls.connect(options, () => {
    console.log('tls.Connect callback');
  });
} else {
  socket = net.connect(options, () => {
    console.log('Connect callback');
  });
}

function timerHandler () {
  if (socketError) {
    process.exit(0);
  }
  if (socketConnected) {
    if (messageIndex < outputText.length) {
      console.log('Write: ', outputText[messageIndex]);
      socket.write(outputText[messageIndex] + '\r\n');
    } else if (messageIndex === outputText.length) {
      console.log('Close HTTP request by sending final EOL: \\r\\n\n');
      socket.write('\r\n');
      // After sending last message wait 2 seconds for responses, then exit
      setTimeout(function () {
        console.log('\n');
        socket.destroy();
        process.exit(0);
      }, 2000);
    }
    messageIndex++;
  }
}
setInterval(timerHandler, sendIntervalMs);

socket.on('secureConnect', () => {
  console.log('Event: secureConnect');
  console.log('socket.authorized ', socket.authorized);
  if (socket.authorizationError) {
    console.log('socket.authorizationError ', socket.authorizationError);
  }
  if (options.tls) socketConnected = true;
});

socket.on('connect', () => {
  console.log('Event: connect');
  if (!options.tls) socketConnected = true;
});

socket.on('ready', () => {
  console.log('Event: ready');
});

let dataNoticePrinted = false;
socket.on('data', (data) => {
  if (!dataNoticePrinted) {
    dataNoticePrinted = true;
    console.log('Event: data\n');
  }
  // Not console.log()
  // No end of line '\n' to handle content split between more than one chunk
  process.stdout.write(data.toString('utf-8'));
});

socket.on('timeout', () => {
  console.log('Event: socket.timeout');
  socketError = true;
});

socket.on('end', () => {
  console.log('Event: socket.end');
});

socket.on('close', (hadError) => {
  console.log('Event: socket.close, hadError=' + hadError +
  ' destroyed=' + socket.destroyed);
  socketConnected = false;
  process.exit(0);
});

socket.on('error', (err) => {
  if (err) {
    console.log('Event: socket.error ' + err.toString());
    socketConnected = false;
    socketError = true;
  }
});
