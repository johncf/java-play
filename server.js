const express = require('express');
const http = require('http');

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('index');
})

app.use(express.static(__dirname + '/static'));

const server = http.createServer(app);

server.listen(8081, function listening() {
  console.log('Listening on %d', server.address().port);
});
