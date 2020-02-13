const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql2");


app.use(express.static(__dirname + '/'));

var jsonParser = bodyParser.json();
  
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "users",
  password: "root"
});

var usersDB = [];
var needToCreate = 1;


var username;

app.post('/newGuestName',jsonParser, function(req, res) {
  // console.log(req);
  // console.log(req.body);
  username = req.body.username;
  
  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "users",
    password: "root"
  });

  connection.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      
    }
  });
  var check = 0;
  connection.query("SELECT * FROM players", function(err, results) {
    usersDB = results;
    for (var i = 0; i < results.length; i++) {
      
      if (results[i].nickname == req.body.username) {
        
        res.send(JSON.stringify({'value': 0}));
        check = 1;
        break;
      }
    }
    if (!check) res.send(JSON.stringify({'value': 1}));
  });
});

app.post('/newUserName',jsonParser, function(req, res) {
  // console.log(req);
  // console.log(req.body);
  username = req.body.username;
  // console.log(JSON.parse(req.body).username);
 
  res.send(JSON.stringify({'value': 1}));
});


app.post('/newPlayer',jsonParser, function(req, res) {

  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "users",
    password: "root"
  });

  connection.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      
    }
  });

  connection.query("SELECT * FROM players", function(err, results) {
    usersDB = results;
    for (var i = 0; i < results.length; i++) {
      
      if (results[i].nickname == req.body.name) {
        needToCreate = 0;
        break;
      } else needToCreate = 1;
    }

    if (needToCreate) {
      var iter = 0;
      var newUser = [req.body.name, req.body.password];
      const sql = "INSERT INTO players(nickname, password) VALUES(?, ?)";
      connection.query(sql, newUser, function(err, results) {

        connection.destroy();
      });
      res.send(JSON.stringify({connection: 1}));
    } else {
      res.send(JSON.stringify({connection: 0}));
    }
  });

});

app.get('/game', function(req, res) {
  // console.log('try');
  // console.log(req.body);
  res.sendFile(__dirname + "/html/game.html");
});

app.get('/', function(req, res) {
  
  // res.write();
  res.sendFile(__dirname + "/index.html");
});

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
// console.log(users);
var color = 'blue';
var clients = {};
var positions = {};

sio.sockets.on('connection', (socket) => {
  // console.log(users);
  // console.log(socket.id);
  var sellID = Math.floor(Math.random() * 169);

  // console.log(sellID);
  if (users == 0) {
    color = 'blue';
  } else if (users == 1) {
    color = 'red';
  } else if (users == 2) {
    color = 'green';
  }
  users++;
  // console.log(users);
  // console.log(socket.id);

  var needToUnshiftFirst = 0;
  var needToUnshiftSecond = 0;

  if (users > 2) {
    for (var i in clients) {
      // console.log(clients[i].myID + '\n');
      if (clients[i].gameID == 1) {
        needToUnshiftSecond = 0;
        break;
      } else needToUnshiftSecond = 1;
    }
    if (needToUnshiftSecond) {
      clients[socket.id] = {
        'sell': sellID,
        'color': 'red',
        'score': 0,
        'userName': username,
        'gameID': 1
      }
      positions[socket.id] = sellID;
      socket.json.send({'answerID': 0,'gameID': clients[socket.id].gameID, 'userName': clients[socket.id].userName, 'sell': clients[socket.id].sell, 'color': clients[socket.id].color, 'score': clients[socket.id].score});
      socket.broadcast.json.send({'answerID': 1,'gameID': clients[socket.id].gameID, 'userName': clients[socket.id].userName, 'sell': clients[socket.id].sell, 'color': clients[socket.id].color, 'score': clients[socket.id].score});
      for (var key in clients) {
        if (key == socket.id) continue;
        socket.json.send({'answerID': 2,'gameID': clients[key].gameID, 'userName': clients[key].userName, 'sell': clients[key].sell, 'color': clients[key].color, 'score': clients[key].score});
    
      }
    }
  }


  if (users > 1) {
    for (var i in clients) {
      if (clients[i].gameID == 0) {
        needToUnshiftFirst = 0;
        break;
      } else needToUnshiftFirst = 1;
    }
    if (needToUnshiftFirst) {
      clients[socket.id] = {
        'sell': sellID,
        'color': 'blue',
        'score': 0,
        'userName': username,
        'gameID': 0
      }
      positions[socket.id] = sellID;
      socket.json.send({'answerID': 0,'gameID': clients[socket.id].gameID, 'userName': clients[socket.id].userName, 'sell': clients[socket.id].sell, 'color': clients[socket.id].color, 'score': clients[socket.id].score});
      socket.broadcast.json.send({'answerID': 1,'gameID': clients[socket.id].gameID, 'userName': clients[socket.id].userName, 'sell': clients[socket.id].sell, 'color': clients[socket.id].color, 'score': clients[socket.id].score});
      for (var key in clients) {
        if (key == socket.id) continue;
        socket.json.send({'answerID': 2,'gameID': clients[key].gameID, 'userName': clients[key].userName, 'sell': clients[key].sell, 'color': clients[key].color, 'score': clients[key].score});
    
      }
    }
  }
  if (!needToUnshiftFirst && !needToUnshiftSecond) {
    clients[socket.id] = {
      'sell': sellID,
      'color': color,
      'score': 0,
      'userName': username,
      'gameID': users - 1
    }
    positions[socket.id] = sellID;
    socket.json.send({'answerID': 0,'gameID': clients[socket.id].gameID, 'userName': clients[socket.id].userName, 'sell': clients[socket.id].sell, 'color': clients[socket.id].color, 'score': clients[socket.id].score});
    socket.broadcast.json.send({'answerID': 1,'gameID': clients[socket.id].gameID, 'userName': clients[socket.id].userName, 'sell': clients[socket.id].sell, 'color': clients[socket.id].color, 'score': clients[socket.id].score});
    // console.log(clients);
    for (var key in clients) {
      if (key == socket.id) continue;
      socket.json.send({'answerID': 2,'gameID': clients[key].gameID, 'userName': clients[key].userName, 'sell': clients[key].sell, 'color': clients[key].color, 'score': clients[key].score});
  
    }
  }
  // console.log(positions);


  socket.on('message', function(data) {
    data = JSON.parse(data);
    if (data.answerID == 1) {
      var sell = data.sell;
      data.sell += 13;
      socket.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
      socket.broadcast.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
      positions[socket.id] = data.sell;


      for (var key in positions) {
        if (key == socket.id) continue;
        if (data.sell == positions[key]) {
          var newSell = Math.floor(Math.random() * 169);
          clients[socket.id].score += 1;
          clients[key].sell = newSell;
          positions[key] = newSell;
          socket.json.send({'answerID': 5, 'lastSell': data.sell, 'newSell': newSell, 'loseColor': clients[key].color, 'winColor': data.color, 'score': clients[socket.id].score});
          socket.broadcast.json.send({'answerID': 5, 'lastSell': data.sell, 'newSell': newSell, 'loseColor': clients[key].color, 'winColor': data.color, 'score': clients[socket.id].score});
        }
      }


    } else if (data.answerID == 2) {
      var sell = data.sell;
      data.sell -= 13;
      socket.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
      socket.broadcast.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
      positions[socket.id] = data.sell;

      for (var key in positions) {
        if (key == socket.id) continue;
        if (data.sell == positions[key]) {
          var newSell = Math.floor(Math.random() * 169);
          clients[socket.id].score += 1;
          clients[key].sell = newSell;
          positions[key] = newSell;
          socket.json.send({'answerID': 5, 'lastSell': data.sell, 'newSell': newSell, 'loseColor': clients[key].color, 'winColor': data.color, 'score': clients[socket.id].score});
          socket.broadcast.json.send({'answerID': 5, 'lastSell': data.sell, 'newSell': newSell, 'loseColor': clients[key].color, 'winColor': data.color, 'score': clients[socket.id].score});
        }
      }


    } else if (data.answerID == 3) {
      var sell = data.sell;
      data.sell -= 1;
      socket.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
      socket.broadcast.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
      positions[socket.id] = data.sell;


      for (var key in positions) {
        if (key == socket.id) continue;
        if (data.sell == positions[key]) {
          var newSell = Math.floor(Math.random() * 169);
          clients[socket.id].score += 1;
          clients[key].sell = newSell;
          positions[key] = newSell;
          socket.json.send({'answerID': 5, 'lastSell': data.sell, 'newSell': newSell, 'loseColor': clients[key].color, 'winColor': data.color, 'score': clients[socket.id].score});
          socket.broadcast.json.send({'answerID': 5, 'lastSell': data.sell, 'newSell': newSell, 'loseColor': clients[key].color, 'winColor': data.color, 'score': clients[socket.id].score});
        }
      }


    } else if (data.answerID == 4) {
      var sell = data.sell;
      data.sell += 1;
      socket.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
      socket.broadcast.json.send({'answerID': 3, 'sell': data.sell, 'lastSell': sell, 'color': data.color});
      positions[socket.id] = data.sell;


      for (var key in positions) {
        if (key == socket.id) continue;
        if (data.sell == positions[key]) {
          var newSell = Math.floor(Math.random() * 169);
          clients[socket.id].score += 1;
          clients[key].sell = newSell;
          positions[key] = newSell;
          socket.json.send({'answerID': 5, 'lastSell': data.sell, 'newSell': newSell, 'loseColor': clients[key].color, 'winColor': data.color, 'score': clients[socket.id].score});
          socket.broadcast.json.send({'answerID': 5, 'lastSell': data.sell, 'newSell': newSell, 'loseColor': clients[key].color, 'winColor': data.color, 'score': clients[socket.id].score});
        }
      }



    }
    clients[socket.id].sell = data.sell;
    positions[socket.id] = data.sell;
    // console.log(positions);
  });
  // console.log(clients);


  socket.on('disconnect', function() {
    // console.log(clients);
    // console.log(clients);
    socket.broadcast.json.send({'answerID': 4, 'sell': clients[socket.id].sell, 'color': clients[socket.id].color});
    delete clients[socket.id];
    delete positions[socket.id];
    users--;
	});
});


app.listen(3000, '127.0.0.1');
// console.log("Server has started.");