const socket = io();

const form = document.getElementById("messageForm");
const messageInput = form.querySelector("input");
const formBtn = form.querySelector("button");
const locationBtn = document.getElementById("share_location");

socket.on("message", message => {
  console.log(message);
});

form.addEventListener("submit", event => {
  event.preventDefault();
  formBtn.setAttribute("disabled", "disabled");
  const message = messageInput.value;
  socket.emit("sendMessage", message, error => {
    formBtn.removeAttribute("disabled");
    messageInput.value = "";
    messageInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log("Delivered");
  });
});

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your broswer");
  }

  locationBtn.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      "shareLocation",
      {
        long: position.coords.longitude,
        lat: position.coords.longitude
      },
      () => {
        locationBtn.removeAttribute("disabled");
        console.log("Location shared succefully");
      }
    );
  });
});
