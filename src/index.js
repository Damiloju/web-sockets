const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

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

  socket.on("sendMessage", message => {
    io.emit("message", message);
  });

  socket.on("shareLocation", position => {
    io.emit(
      "message",
      `https://google.com/maps?=${position.lat},${position.long}`
    );
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left");
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
