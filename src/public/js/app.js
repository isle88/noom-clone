const socket = io();
const welcome = document.getElementById("welcome");
const nickForm = welcome.querySelector("#name");
const roomForm = welcome.querySelector("#room_name");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMsgSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_msg", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.emit("nickname", input.value);
    nickForm.hidden = true;
}
nickForm.addEventListener("submit", handleNicknameSubmit);

function showRoom(msg) {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName}`;
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMsgSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = roomForm.querySelector("input");
  socket.emit("join_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}
roomForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome_msg", (user) => {
  addMessage(`${user} joined!`);
});

socket.on("bye", (user) => {
  addMessage(`${user} left...`);
});

socket.on("new_msg", addMessage);
