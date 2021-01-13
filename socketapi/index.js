const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");
const body_parser = require("body-parser");

app.use(body_parser());
app.use(cors());
app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("chat", (data) => {
    // console.log(data);
    io.sockets.emit("chat", `${data.handle}: ${data.message}`);
    socket.broadcast.emit("feedback", "");
  });

  socket.on("feedback", (data) => {
    // console.log("feedback");
    console.log(data);
    socket.broadcast.emit("feedback", data);
  });

  socket.on("speed", (data) => {
    console.log(data, "data");
    io.sockets.emit("speed", data);
  });

  socket.on("join", (room) => {
    console.log(`Joining room ${room}`);
    socket.join("room");
  });
});

const hello = io.of("/hello");

hello.on("connection", (socket) => {
  // console.log("connected");
  socket.on("speed", (data) => {
    console.log(data, "data");
    hello.emit("speed", data);
  });
  socket.join("room");
  hello.to("room").emit("event");
});

const roomsIO = io.of("/roomsIO");

roomsIO.on("connection", (socket) => {
  // console.log("connected");
});

server.listen(2000, () => console.log("Active"));
