const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(express.static(__dirname + '/'));

app.get('/game', function(req, res) {
  // console.log('try');
  // console.log(req.body);
  res.sendFile(__dirname + "/html/game.html");
});

app.get('/', function(req, res) {
  console.log(req.body);
  res.write();
  res.sendFile(__dirname + "/index.html");
});

var jsonParser = bodyParser.json();

var username;

app.post('/newUserName',jsonParser, function(req, res) {
  // console.log(req);
  // console.log(req.body);
  username = req.body.username;
  // console.log(JSON.parse(req.body).username);
  console.log(username);
  res.send(JSON.stringify({'value': 1}));
});

app.use(express.urlencoded());


//WEBSOCKET GAME
const sio = require('socket.io').listen(8081);
var users = 0;
var color = 'blue';
var clients = {};
var positions = [];

sio.sockets.on('connection', (socket) => {
  var sellID = Math.floor(Math.random() * 169);
  // console.log(sellID);
  if (users == 1) {
    color = 'red';
  } else if (users == 2) {
    color = 'green';
  }
  users++;

  // if (users >= 1 ) {
  //   if ()
  // }






  clients[socket.id] = {
    'sell': sellID,
    'color': color,
    'score': 0,
    'userName': username,
    'gameID': users - 1
  }

  socket.json.send({'answerID': 0,'gameID': clients[socket.id].gameID, 'userName': clients[socket.id].userName, 'sell': clients[socket.id].sell, 'color': clients[socket.id].color, 'score': clients[socket.id].score});
  socket.broadcast.json.send({'answerID': 1,'gameID': clients[socket.id].gameID, 'userName': clients[socket.id].userName, 'sell': clients[socket.id].sell, 'color': clients[socket.id].color, 'score': clients[socket.id].score});
  // console.log(clients);
  for (var key in clients) {
    if (key == socket.id) continue;
    socket.json.send({'answerID': 2,'gameID': clients[key].gameID, 'userName': clients[key].userName, 'sell': clients[key].sell, 'color': clients[key].color, 'score': clients[key].score});

  }

  socket.on('message', function(data) {
    data = JSON.parse(data);
    if (data.answerID == 1) {
      var sell = data.sell;
      data.sell += 13;
      socket.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
      socket.broadcast.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
    } else if (data.answerID == 2) {
      var sell = data.sell;
      data.sell -= 13;
      socket.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
      socket.broadcast.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
    } else if (data.answerID == 3) {
      var sell = data.sell;
      data.sell -= 1;
      socket.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
      socket.broadcast.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
    } else if (data.answerID == 4) {
      var sell = data.sell;
      data.sell += 1;
      socket.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
      socket.broadcast.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
    }
    clients[socket.id].sell = data.sell;
  });
  console.log(clients);


  socket.on('disconnect', function() {
    // console.log(clients);
    // console.log(clients);
    socket.broadcast.json.send({'answerID': 4, 'sell': clients[socket.id].sell, 'color': clients[socket.id].color});
    delete clients[socket.id];
    users--;
	});
});


app.listen(3000, '127.0.0.1');
console.log("Server has started.");