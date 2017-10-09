"use strict";

const UQueue = require('./uq.js')
const nano = require('nanomsg');

var worker = nano.socket('pair');
worker.connect('tcp://127.0.0.1:8082');

var clientQ = new UQueue(); // the front of the queue is the one getting compiled.
var nextSeq = 1;

worker.on('data', function(buf) {
  let msg = JSON.parse(buf);
  let qfront = clientQ.peek();
  if (!qfront) {
    console.error("Client queue empty on message!");
    return;
  }
  let [id, data] = qfront;
  if (data.seqnum == msg.seqnum) {
    if (msg.done) {
      clientQ.deQ();
      compileNext();
    }
    delete msg.seqnum;
    data.callback(msg);
  }
});

function compileNext() {
  if (clientQ.length == 0) {
    return;
  }
  let data = clientQ.peek()[1];
  worker.send(JSON.stringify({
    seqnum: data.seqnum,
    source: data.source,
    stdin: data.stdin
  }));
}

module.exports.queue = function(clientId, source, callback, stdin=null) {
  let data = {
    seqnum: nextSeq,
    source: source,
    stdin: stdin,
    callback: callback
  };
  clientQ.enQ(clientId, data);
  if (clientQ.length == 1) {
    compileNext();
  }
  nextSeq += 1;
}
