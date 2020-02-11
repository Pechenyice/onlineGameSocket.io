const express = require('express');

const app = express();
app.use(express.static(__dirname + '/'));

app.get('/game', function(req, res) {
  res.sendFile(__dirname + "/html/game.html");
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use(express.urlencoded());


//WEBSOCKET GAME
const sio = require('socket.io').listen(8081);
var users = 0;
var color = 'blue';
var sellID = 84;
var clients = [];
var positions = [];

sio.sockets.on('connection', (socket) => {
  var userObject = {
    myID: -1,
    myColor: '404',
    mySell: -1,
    socketID: socket.id
  }
  users++;
  if (users == 1) {
    color = 'blue';
    sellID = 84;
  }
  if (users == 2) {
    color = 'red';
    sellID = 85;
  } else if (users == 3) {
    color = 'green';
    sellID = 86;
  }
  positions[socket.id] = sellID;
  // console.log("i am alive");
  var needToUnshiftFirst = 0;
  var needToUnshiftSecond = 0;

  if (users > 2) {
    for (var i = 0; i < clients.length; i++) {
      // console.log(clients[i].myID + '\n');
      if (clients[i].myID == 2) {
        needToUnshiftSecond = 0;
        break;
      } else needToUnshiftSecond = 1;
    }
    if (needToUnshiftSecond) {
      userObject.myID = 2;
      userObject.myColor = 'red';
      userObject.mySell = 85;
      clients.splice(1, 0, userObject);
      socket.json.send({'socketID': userObject.socketID, 'answerID': 0, 'currentID': 2, 'color': 'red', 'sellID': 85});
      socket.broadcast.json.send({'answerID': 1, 'currentID': 2, 'color': 'red', 'sellID': 85});
    }
  }

  if (users > 1) {
    for (var i = 0; i < clients.length; i++) {
      if (clients[i].myID == 1) {
        needToUnshiftFirst = 0;
        break;
      } else needToUnshiftFirst = 1;
    }
    if (needToUnshiftFirst) {
      userObject.myID = 1;
      userObject.myColor = 'blue';
      userObject.mySell = 84;
      clients.unshift(userObject);
      socket.json.send({'socketID': userObject.socketID, 'answerID': 0, 'currentID': 1, 'color': 'blue', 'sellID': 84});
      socket.broadcast.json.send({'answerID': 1, 'currentID': 1, 'color': 'blue', 'sellID': 84});
    }
  }
  if (!needToUnshiftFirst && !needToUnshiftSecond) {
    userObject.myID = users;
    userObject.myColor = color;
    userObject.mySell = sellID;
    clients.push(userObject);
    socket.json.send({'socketID': userObject.socketID, 'answerID': 0, 'currentID': users, 'color': color, 'sellID': sellID});
    socket.broadcast.json.send({'answerID': 1, 'currentID': users, 'color': color, 'sellID': sellID});
  }
  // console.log(clients);
  if (users > 1) {
    for (var i = 0; i < users; i++) {
      socket.json.send({'answerID': 1, 'currentID': clients[i].myID, 'color': clients[i].myColor, 'sellID': clients[i].mySell});
    }
  }
  socket.on('message', function(data) {
    // console.log(socket.id);
    /////////////////////
    data = JSON.parse(data);




    if (data.answerID == 3) {
      data.sellID += 13;
      for (var i = 0; i < clients.length; i++) {
        if (data.myID == clients[i].myID) {
          clients[i].mySell = data.sellID;
        }
      }
    }

    if (data.answerID == 4) {
      data.sellID -= 13;
      for (var i = 0; i < clients.length; i++) {
        if (data.myID == clients[i].myID) {
          clients[i].mySell = data.sellID;
        }
      }
    }

    if (data.answerID == 5) {
      data.sellID -= 1;
      for (var i = 0; i < clients.length; i++) {
        if (data.myID == clients[i].myID) {
          clients[i].mySell = data.sellID;
        }
      }
    }

    if (data.answerID == 6) {
      data.sellID += 1;
      for (var i = 0; i < clients.length; i++) {
        if (data.myID == clients[i].myID) {
          clients[i].mySell = data.sellID;
        }
      }
    }
    positions[socket.id] = data.sellID;
    // console.log(data);
    // console.log(clients);
    console.log(positions);
    data.answerID = 3;
    socket.json.send(data);
    socket.broadcast.json.send(data);
  });



  socket.on('disconnect', function() {
    for (var i = 0; i < clients.length; i++) {
      if (userObject.myID == clients[i].myID) {
        socket.broadcast.json.send({'answerID': 2, 'currentID': clients[i].myID, 'color': clients[i].myColor, 'sellID': clients[i].mySell});
        clients.splice(i, 1);
      }
    }
    // console.log(clients);
		users--;
	});
});


app.listen(3000, '127.0.0.1');
console.log("Server has started.");