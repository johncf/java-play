"use strict";

const UQueue = require('./uq.js')
const nano = require('nanomsg');

var worker = nano.socket('pair');
worker.connect('tcp://127.0.0.1:8082');

var clientQ = new UQueue();
var nextSeq = 1;

worker.on('data', function(buf) {
  let msg = JSON.parse(buf);
  let [id, data] = clientQ.peek();
  if (msg.done) {
    clientQ.deQ();
  }
  if (data.seqnum == msg.seqnum) {
    delete msg.seqnum;
    data.callback(msg);
  }
});

module.exports.queue = function(clientId, source, callback, stdin=null) {
  clientQ.enQ(clientId, { source: source,
                          callback: callback,
                          seqnum: nextSeq,
                          stdin: stdin });
  if (clientQ.length == 1) {
    worker.send(JSON.stringify({
      seqnum: nextSeq,
      source: source,
      stdin: stdin
    }))
  }
  nextSeq += 1;
}
