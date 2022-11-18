// HTTP Raw Client
//
// NodeJs application to open socket and
//    issue one raw HTTP request
//    for use in testing a web server.
//
// Before use:
// - Enter host, port into options object
// - Enter raw request into outputText array
//
// To Run: node app.js
// Response console.logged to stdout
// ------------------------------------------
'use strict';
const net = require('net'); 
const process = require('process');

// Variables
const sendIntervalMs = 100;
let messageIndex = 0;
let socketConnected = false;
let socketError = false;

// --------------------------------
// Address, port for HTTP request
// --------------------------------
let options = {
  port: 8000,
  host: 'localhost'
}

// ------------------------
// Array of strings to be 
// sent to the web server.
// ------------------------
const outputText = [
  'GET / HTTP/1.1',
  'Host: localhost',
  'User-Agent: agent',
  ''
];

const socket = net.connect(options, () => { 
  console.log('Connect callback');
});

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
        socket.destroy();
        process.exit(0);
      }, 2000);
    }
  }
}
setInterval(timerHandler, sendIntervalMs);

socket.on('connect', () => {
  console.log('Event: connect');
});

socket.on('ready', () => {
  console.log('Event: ready');
  socketConnected = true;
});

socket.on('data', (data) => {
  console.log('Event: data from ' + socket.address().address + ' port ' + socket.address().port);
  console.log(data.toString('utf-8'));
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
