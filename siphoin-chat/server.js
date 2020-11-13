const shortid = require('shortid');
const { Socket } = require('socket.io-client');

rooms = []
sockets = []
users = []

const PORT = 3000;

const INTERVAL_CLEAR_CONSOLE = 180000;

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

setInterval(() => {
  clearConsole();
}, INTERVAL_CLEAR_CONSOLE);


app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});


io.on('connection', (socket) => {

sockets[socket.id] = socket;
  console.log('new connect: ' + socket.id);


    socket.emit('get_id', {
      id: socket.id
    })



  socket.on('disconnect', () => {
    delete sockets[socket.id];

    console.log('disconnect: ' + socket.id);
    userName = "";
    if (users[socket.id]) {
    userName = users[socket.id].name
delete users[socket.id];
    }

for (roomId in rooms) {
  if (rooms[roomId].users[socket.id]) {

    delete rooms[roomId].users[socket.id];
    rooms[roomId].countUsers--

    io.to(rooms[roomId].name).emit("user_leaved", {
      name: userName
    })
    if (rooms[roomId].countUsers == 0) {
      console.log(" Room " + rooms[roomId].name + " cleared, because in the room list users is emtry")
      delete rooms[roomId];
      break;
    }
  }
}
  });

  socket.on('add_user', (data) => {
    userExits = userExitsByName(data.name);

    if (userExits == false) {
      newUser = {
        name: data.name,
        id: socket.id,
      }

      users[socket.id] = newUser;

      console.log("new user ", newUser);
      socket.emit('user_added');
    }

    else {
      console.log("Warming: User " + data.name + " already exits. Current socket disconnected");
      socket.disconnect();
    }

  });

  socket.on('join_room', (data) => {
    socket.join(data.room);

    if (!rooms[data.room]) {

      newRoom = {
        name: data.room,
        id: shortid.generate(),
        users: [],
        messages: [],
        countUsers: 0,
        messageCount: 0,
      }

      rooms[data.room] = newRoom;
      console.log('new room: ', rooms[data.room])
    }
for (messageId in rooms[data.room].messages) {
  currentMessage = rooms[data.room].messages[messageId]
  socket.emit("new_message", {
   message: currentMessage.msg,
   id: currentMessage.id,
   name: currentMessage.name,
   owner: currentMessage.owner
  })
}
      rooms[data.room].users[socket.id] = users[socket.id]
      rooms[data.room].countUsers++
      console.log("users room " + rooms[data.room].name + "\n", rooms[data.room].users)
    socket.emit("on_join_room")
    for (userId in users) {
      socket.emit("user_joined", {
        name: users[userId].name
      })
    }

    socket.broadcast.emit("user_joined", {
      name: users[socket.id].name
    })
  });


  socket.on('send_message', (data) => {
          newMessage = {
            msg: data.msg,
            id: shortid.generate(),
            name: data.name,
            owner: socket.id
          }

          rooms[data.room].messages[newMessage.id] = newMessage;
          rooms[data.room].messageCount++
          console.log("new message: ", newMessage)

          io.to(data.room).emit("new_message", {
            id: socket.id,
            message: data.msg,
            name: data.name
          });


  });
});


http.listen(PORT, () => {
  clearConsole();
  console.log('server started: Port: ' + PORT);
});


function clearConsole() {
  process.stdout.write('\033c');
}

function userExitsByName(name) {
  for (userId in users) {
    if (users[userId].name == name) {
      return true;
    }
  }
  return false;
}

