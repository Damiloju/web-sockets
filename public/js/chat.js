const socket = io();

socket.on("message", message => {
  console.log(message);
});

const form = document.getElementById("messageForm");

form.addEventListener("submit", event => {
  event.preventDefault();
  const message = event.target.elements.message.value;
  socket.emit("sendMessage", message);
});

const locationBtn = document.getElementById("share_location");

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your broswer");
  }

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit("shareLocation", {
      long: position.coords.longitude,
      lat: position.coords.longitude
    });
  });
});
