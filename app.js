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
const sendIntervalMs = 100;
let messageIndex = 0;
let socketConnected = false;
let socketError = false;

// --------------------------------
//
//   1 of 2 SET THIS (options)
//
// Address, port, tls=true/false
// --------------------------------
let options = {
  port: 8000,
  host: 'localhost',
  tls: false,
  verifyTlsHost: true
}

if (options.tls) {
  options.servername = options.host;
  options.rejectUnauthorized = options.verifyTlsHost;
  options.  minVersion = 'TLSv1.2';
}

let appendPortToHost = '';
if ((options.port !== 80) && (options.port !== 443))
appendPortToHost = ':' + options.port.toString();

// ----------------------------------------------
//
//    2 of 2 SET THIS (outputText)
//
// Array of strings to be sent to the web server.
// The \r\n is appended automatically
// Note empty string at the end.
// ----------------------------------------------
const outputText = [
  'GET / HTTP/1.1',
  'Host: ' + options.host + appendPortToHost,
  'User-Agent: custom-user-agent-for-testing',
  ''
];

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
    }
    messageIndex++;
    // After sending last message wait 2 seconds for responses, then exit
    if (messageIndex > outputText.length) {
      setTimeout(function() {
        console.log('\n');
        socket.destroy();
        process.exit(0);
      }, 2000);
    }
  }
}
setInterval(timerHandler, sendIntervalMs);

socket.on('secureConnect', () => {
  console.log('Event: secureConnect');
  console.log('socket.authorized ', socket.authorized);
  console.log('socket.authorizationError ', socket.authorizationError);
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
})

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
