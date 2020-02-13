
// window.onload = function() {
    var user = {
        color: 'none',
        sell: -1,
        score: -1,
        userName: 'user',
        gameID: -1
    };
    // var users = [];

    socket = io.connect('localhost:8081');
    socket.on('connect', () => {
        socket.on('message', (data) => {
            // console.log(data);
            // data = JSON.parse(data);
            if (data.answerID == 0){
                user.color = data.color;
                user.sell = data.sell;
                user.score = data.score;
                user.userName = data.userName;
                user.gameID = data.gameID;
                document.getElementsByClassName('sell')[user.sell].setAttribute('id', user.color);
                if (data.color == 'blue') {
                    document.getElementById('blueScore').innerHTML = data.userName+': <span id="blueScoreValue">0</span>';
                } else if (data.color == 'red') {
                    document.getElementById('redScore').innerHTML = data.userName+': <span id="redScoreValue">0</span>';
                } else if (data.color == 'green') {
                    document.getElementById('greenScore').innerHTML = data.userName+': <span id="greenScoreValue">0</span>';
                }
            }
            // console.log(user);

            if (data.answerID == 1){
                document.getElementsByClassName('sell')[data.sell].setAttribute('id', data.color);
                if (data.color == 'blue') {
                    document.getElementById('blueScore').innerHTML = data.userName+': <span id="blueScoreValue">0</span>';
                } else if (data.color == 'red') {
                    document.getElementById('redScore').innerHTML = data.userName+': <span id="redScoreValue">0</span>';
                } else if (data.color == 'green') {
                    document.getElementById('greenScore').innerHTML = data.userName+': <span id="greenScoreValue">0</span>';
                }
            }

            if (data.answerID == 2){
                // console.log(data);
                // console.log(data.sellID);
                // console.log(data.color);
                document.getElementsByClassName('sell')[data.sell].setAttribute('id', data.color);
                if (data.color == 'blue') {
                    document.getElementById('blueScore').innerHTML = data.userName+': <span id="blueScoreValue">'+data.score+'</span>';
                } else if (data.color == 'red') {
                    document.getElementById('redScore').innerHTML = data.userName+': <span id="redScoreValue">'+data.score+'</span>';
                } else if (data.color == 'green') {
                    document.getElementById('greenScore').innerHTML = data.userName+': <span id="greenScoreValue">'+data.score+'</span>';
                }
            }



            if (data.answerID == 3){
                for (var i = 0; i < 169; i++) {
                   if (document.getElementsByClassName('sell')[i].getAttribute('id') == data.color) document.getElementsByClassName('sell')[i].removeAttribute('id', data.color);
                }
                document.getElementsByClassName('sell')[data.sell].setAttribute('id', data.color);
                document.getElementsByClassName('sell')[data.lastSell].removeAttribute('id', data.color);
                
                // console.log(data);
            }

            if (data.answerID == 4){
                document.getElementsByClassName('sell')[data.sell].removeAttribute('id', data.color);
                
                if (data.color == 'blue') {
                    document.getElementById('blueScore').innerHTML = 'user 1: <span id="blueScoreValue">0</span>';
                } else if (data.color == 'red') {
                    document.getElementById('redScore').innerHTML = 'user 2: <span id="redScoreValue">0</span>';
                } else if (data.color == 'green') {
                    document.getElementById('greenScore').innerHTML = 'user 3: <span id="greenScoreValue">0</span>';
                }
            }


            if (data.answerID == 5){
                console.log(data);
                document.getElementsByClassName('sell')[data.newSell].setAttribute('id', data.loseColor);

                if (data.winColor == 'blue') {
                    document.getElementById('blueScoreValue').innerHTML = data.score;
                }
                if (data.winColor == 'red') {
                    document.getElementById('redScoreValue').innerHTML = data.score;
                }
                if (data.winColor == 'green') {
                    document.getElementById('greenScoreValue').innerHTML = data.score;
                }
                console.log(user);
                console.log(user.color == data.loseColor);
                if (user.color == data.loseColor) {
                    user.sell = data.newSell;
                }
                console.log(user);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        // console.log(event.code);
        if (event.code == 'ArrowDown') {
            if (user.sell < 156) {
                ///////////////////////////
                // alert(socket.id);
                // console.log(user);
                socket.send(JSON.stringify({'answerID': 1, 'sell': user.sell, 'color': user.color}));
                user.sell += 13;
            }
        }
    
        if (event.code == 'ArrowUp') {
            if (user.sell > 12) {
                ///////////////////////////
                // alert(socket.id);
                // console.log(user);
                socket.send(JSON.stringify({'answerID': 2, 'sell': user.sell, 'color': user.color}));
                user.sell -= 13;
            }
        }
    
        if (event.code == 'ArrowLeft') {
            if (user.sell % 13 != 0) {
                ///////////////////////////
                // alert(socket.id);
                // console.log(user);
                socket.send(JSON.stringify({'answerID': 3, 'sell': user.sell, 'color': user.color}));
                user.sell -= 1;
            }
        }
    
        if (event.code == 'ArrowRight') {
            if (user.sell % 13 != 12) {
                ///////////////////////////
                // alert(socket.id);
                // console.log(user);
                socket.send(JSON.stringify({'answerID': 4, 'sell': user.sell, 'color': user.color}));
                user.sell += 1;
            }
        }
    });

// }