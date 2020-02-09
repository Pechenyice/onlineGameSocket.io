const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');

const app = express();

app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/dataBase/'));
app.use(express.static(__dirname + '/chat/'));
app.use(express.static(__dirname + '/game/'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get('/game', function(req, res) {
  res.sendFile(__dirname + "/game/game.html");
});

app.get('/chat', function(req, res) {
  res.sendFile(__dirname + "/chat/chat.html");
});

app.get('/trains', function(req, res) {
  res.sendFile(__dirname + "/public/html/trains.html");
});

app.get('/programms', function(req, res) {
  res.sendFile(__dirname + "/public/html/programms.html");
});

app.get('/complexes', function(req, res) {
  res.sendFile(__dirname + "/public/html/complexes.html");
});

app.get('/constructor', function(req, res) {
  res.sendFile(__dirname + "/public/html/constructor.html");
});

app.get('/registration', function(req, res) {
  res.sendFile(__dirname + "/dataBase/registration.html");
});

// const urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(express.urlencoded());
var jsonParser = bodyParser.json();




//REGISTRATION

app.post("/registr",jsonParser, function (request, response) {
  console.log(request.body);
  if(!request.body) return response.sendStatus(400);
  // console.log(request.body);
  // response.sendFile(__dirname + "/dataBase/registration.html");
  // var json = JSON.stringify(request.body);
  // console.log(json);
  var answer = {
    user: {
      login: request.body.login,
      password: request.body.password,
      name: request.body.name
    },
    registration: 0,
    loginError: 0
  };
  // console.log(answer.user.login);

  var bd = fs.readFile("users.txt", "utf8", (err, data) => {
    if (err) {
      console.log("no bd, i created");
      var buf = [{login:"admin", password: "lulv", name:"admin"}];
      // console.log(buf[0].login);
      fs.writeFileSync("users.txt", JSON.stringify(buf));
      data = fs.readFileSync("users.txt", "utf8");
      // console.log(JSON.stringify(buf));
    }
    var bdContent = JSON.parse(data);
    var duplicateUsers = 0;
    for (var i in bdContent) {
      if (bdContent[i].login == request.body.login) {
        console.log("already is!");
        duplicateUsers = 1;
        answer.loginError = 1;
        // response.set('Content-Type', 'text/json');
        response.json(answer);
      }
    }
    if (!duplicateUsers) {
      bdContent[bdContent.length] = {login: request.body.login, password: request.body.password, name: request.body.name};
      fs.writeFileSync("users.txt", JSON.stringify(bdContent));
      answer.registration = 1;
      response.json(answer);
      console.log("bd updated sucessfully!");
    }
  });
});





//WEBSOCKET CHAT

const io = require('socket.io').listen(8080);
// io.set('log level', 1);
io.sockets.on('connection', function (socket) {
	var ID = (socket.id).toString().substr(0, 5);
	var time = (new Date).toLocaleTimeString();
	socket.json.send({'event': 'connected', 'name': ID, 'time': time});
	socket.broadcast.json.send({'event': 'userJoined', 'name': ID, 'time': time});
	socket.on('message', function (msg) {
		var time = (new Date).toLocaleTimeString();
		socket.json.send({'event': 'messageSent', 'name': ID, 'text': msg, 'time': time});
		socket.broadcast.json.send({'event': 'messageReceived', 'name': ID, 'text': msg, 'time': time})
	});
	socket.on('disconnect', function() {
		var time = (new Date).toLocaleTimeString();
		io.sockets.json.send({'event': 'userSplit', 'name': ID, 'time': time});
	});
});




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