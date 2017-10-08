"use strict";

const UQueue = require('./uq.js')

var clientQ = new UQueue();

module.exports.queue = function(clientId, source, callback) {
  callback("Error: not implemented yet");
}
