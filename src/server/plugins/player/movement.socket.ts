
export const event = 'plugin:player:movement';
export const operate = ({ socket }) => {
  const listener = () => {
    console.log('PLAYER MOVEMENT');
  };

  socket.on(event, listener);
};
