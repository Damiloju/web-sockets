const users = [];

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //validate the data
  if (!username || !room) {
    return {
      error: "Username and room are required"
    };
  }

  // Check for existing user
  const existingUser = users.find(user => {
    return user.room === room && user.username === username;
  });

  // Validate Username
  if (existingUser) {
    return {
      error: "Username is in use!"
    };
  }

  // Store user
  const user = {
    id,
    username,
    room
  };

  users.push(user);
  return { user };
};

const removeUser = id => {
  const user = users.findIndex(user => {
    return user.id === id;
  });

  if (user !== -1) {
    return users.splice(user, 1)[0];
  }
};

const getUser = id => {
  const user = users.find(user => {
    return user.id === id;
  });

  return user;
};

const getUserInRoom = room => {
  room = room.trim().toLowerCase();
  const usersInRoom = users.filter(user => {
    return user.room === room;
  });

  return usersInRoom;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUserInRoom
};
