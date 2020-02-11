window.onload = function() {
    var user = {
        currentID: -1,
        color: 'none',
        sellID: -1,
        myGameId: -1
    };
    var users = [];

    socket = io.connect('localhost:8081');
    socket.on('connect', () => {
        socket.on('message', (data) => {
            // data = JSON.parse(data);
            if (data.answerID == 0){
                user.currentID = data.currentID;
                user.color = data.color;
                user.sellID = data.sellID;
                user.myGameId = data.socketID;
                // users.push(user);
                users[socket.id] = user;
                console.log(users);
                document.getElementsByClassName('sell')[user.sellID].setAttribute('id', user.color);
                console.log(data);
            }

            if (data.answerID == 1){
                document.getElementsByClassName('sell')[data.sellID].setAttribute('id', data.color);
                console.log(data);
            }

            if (data.answerID == 2){
                document.getElementsByClassName('sell')[data.sellID].removeAttribute('id', data.color);
                console.log(data);
            }
            //////////////////////
            if (data.answerID == 3){
                // user.color = data.color;
                // user.sellID = data.sellID;
                document.getElementsByClassName('sell')[data.sellID].setAttribute('id', data.color);
                document.getElementsByClassName('sell')[data.lastID].removeAttribute('id', data.color);
                if (data.myID == users[socket.id].currentID) users[socket.id].sellID = data.sellID;
                
                // console.log(data);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        console.log(event.code);
        if (event.code == 'ArrowDown') {
            if (users[socket.id].sellID < 156) {
                ///////////////////////////
                // alert(socket.id);
                // console.log(user);
                socket.send(JSON.stringify({'answerID': 3,'lastID': users[socket.id].sellID, 'sellID': users[socket.id].sellID, 'color': users[socket.id].color, 'myID': users[socket.id].currentID}));
            }
        }
    
        if (event.code == 'ArrowUp') {
            if (users[socket.id].sellID > 12) {
                ///////////////////////////
                // alert(socket.id);
                // console.log(user);
                socket.send(JSON.stringify({'answerID': 4,'lastID': users[socket.id].sellID, 'sellID': users[socket.id].sellID, 'color': users[socket.id].color, 'myID': users[socket.id].currentID}));
            }
        }
    
        if (event.code == 'ArrowLeft') {
            if (users[socket.id].sellID % 13 != 0) {
                ///////////////////////////
                // alert(socket.id);
                // console.log(user);
                socket.send(JSON.stringify({'answerID': 5,'lastID': users[socket.id].sellID, 'sellID': users[socket.id].sellID, 'color': users[socket.id].color, 'myID': users[socket.id].currentID}));
            }
        }
    
        if (event.code == 'ArrowRight') {
            if (users[socket.id].sellID % 13 != 12) {
                ///////////////////////////
                // alert(socket.id);
                // console.log(user);
                socket.send(JSON.stringify({'answerID': 6,'lastID': users[socket.id].sellID, 'sellID': users[socket.id].sellID, 'color': users[socket.id].color, 'myID': users[socket.id].currentID}));
            }
        }
    });

}