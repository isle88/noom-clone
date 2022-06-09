const socket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
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

function showRoom(msg) {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMsgSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const nameInput = form.querySelector("#name");
  const roomNameInput = form.querySelector("#room_name");
  socket.emit("nickname", nameInput.value);
  socket.emit("join_room", roomNameInput.value, showRoom);
  roomName = roomNameInput.value;
  userName = nameInput.value;
}
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome_msg", (user) => {
  addMessage(`${user} joined!`);
});

socket.on("bye", (user) => {
  addMessage(`${user} left...`);
});

socket.on("new_msg", addMessage);
