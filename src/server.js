import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
  socket["nickname"] = "anonymous";
  socket.on("join_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome_msg", socket.nickname);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname));
  });
  socket.on("new_msg", (msg, room, done) => {
    socket.to(room).emit("new_msg", `${socket.nickname}: ${msg}`);
    done(); // doesn't execute on backend. only execute on frontend
  });
  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);

httpServer.listen(3000, handleListen);
