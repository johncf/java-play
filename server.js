const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  res.render('index');
})

app.use(express.static(__dirname + '/static'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const compiler = require('./compiler')

var nextClient = 1;

function setupClient(id, ws) {
  ws.on('message', function(msg) {
    let msgo = null;
    try {
      msgo = JSON.parse(msg);
      console.log('Client %d sent a message', id);
    } catch(err) {
      console.error('Client %d sent a non-json message');
    }
    if (msgo && msgo.hasOwnProperty('source')) {
      ws.send(JSON.stringify({"status": "queued"}));
      compiler.queue(id, msgo.source, function(result) {
        ws.send(JSON.stringify(result));
      });
    } else {
      ws.send(JSON.stringify({"error": "bad request"}));
    }
  });
  ws.on('close', function() {
    console.log('Client %d left', id);
  });
}

wss.on('connection', function(ws, req) {
  const loc = url.parse(req.url, true);

  if (loc.pathname == '/') {
    const id = nextClient;
    console.log('Client %d connected from %s', id, req.connection.remoteAddress);
    setupClient(id, ws);
    nextClient += 1;
  } else {
    ws.close(404, 'Invalid request address');
  }
});

server.listen(8081, function() {
  console.log('Listening on %d', server.address().port);
});
