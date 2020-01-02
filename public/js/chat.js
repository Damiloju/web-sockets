const socket = io();

//elements
const form = document.getElementById("messageForm");
const messageInput = form.querySelector("input");
const formBtn = form.querySelector("button");
const locationBtn = document.getElementById("share_location");
const messages = document.getElementById("messages");
const sidebar = document.getElementById("sidebar");
const mobileHeader = document.getElementById("mobile-header");

//templates
const messageTemplate = document.getElementById("message-template");
const linkTemplate = document.getElementById("link-template");
const sideBarTemplate = document.getElementById("sidebar-template");
const mobileHeaderTemplate = document.getElementById("mobile-header-template");

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const autoscroll = () => {
  //New message element
  const newMessage = messages.lastElementChild;

  //Height of the new message
  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  //Visible height
  const visibleHeight = messages.offsetHeight;

  // Height of messages container
  const contentHeight = messages.scrollHeight;

  // how far have i scrolled
  const scrollOffset = messages.scrollTop + visibleHeight;

  if (contentHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

socket.on("message", message => {
  const html = Mustache.render(messageTemplate.innerHTML, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a")
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", location => {
  const html = Mustache.render(linkTemplate.innerHTML, {
    username: location.username,
    location: location.url,
    createdAt: moment(location.createdAt).format("h:mm a")
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sideBarTemplate.innerHTML, {
    room,
    users
  });

  const headerHtml = Mustache.render(mobileHeaderTemplate.innerHTML, {
    room
  });

  sidebar.innerHTML = html;
  mobileHeader.innerHTML = headerHtml;
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
      return alert(error);
    }

    // alert("Message Delivered");
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
        alert("Location shared succefully");
      }
    );
  });
});

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
