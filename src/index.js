const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

const {
  generateMessage,
  generateLocationMessage
} = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 6034;
const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));

io.on("connection", socket => {
  console.log("New Web socket connection");
  socket.on("join", ({ username, room }) => {
    socket.join(room);
    socket.emit("message", generateMessage("Welcome"));

    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${username} has joined the chat`));
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }

    io.to("room").emit("message", generateMessage(message));
    callback();
  });

  socket.on("shareLocation", (position, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?=${position.lat},${position.long}`
      )
    );

    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left"));
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
