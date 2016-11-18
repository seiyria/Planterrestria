
import { State } from '../../core/gameloop';

export const event = 'plugin:map:request';

export const operate = ({ socket, respond }) => {
  const listener = () => {
    respond({
      update: 'Map',
      data: State.world
    });
  };

  socket.on(event, listener);
};
