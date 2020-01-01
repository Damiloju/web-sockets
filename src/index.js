const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 6034;
const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));

let count = 0;

io.on("connection", socket => {
  console.log("New Web socket connection");
  socket.emit("message", "Welcome");

  socket.broadcast.emit("message", "A new user has joined");

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }

    io.emit("message", message);
    callback();
  });

  socket.on("shareLocation", (position, callback) => {
    io.emit(
      "locationMessage",
      `https://google.com/maps?=${position.lat},${position.long}`
    );

    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left");
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
