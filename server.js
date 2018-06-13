let express = require('express');
let redis = require('redis');
let WebSocket = require('ws');
const wss = new WebSocket.Server({port:3000});
let client = redis.createClient();
let app = express();
function get(ws) {
  client.lrange('barrage', 0, -1, function (err, data) {
    data = data.map(item => JSON.parse(item));
    ws.send(JSON.stringify(data));
  });
}
let arr = [];
wss.on('connection', function (ws) {
  arr.push(ws);
  get(ws);
  ws.on('message',function (data) {
    client.rpush('barrage', data); // 放进去
    arr.forEach(w=>{
      w.send(data);
    })
  })
});