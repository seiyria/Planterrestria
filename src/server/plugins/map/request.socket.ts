
import { State } from '../../core/gameloop';
import { Map } from '../../../shared/models/map';

export const event = 'plugin:map:request';

export const operate = ({ socket, respond }) => {
  const listener = () => {
    respond({
      update: 'Map',
      data: State.world
    })
  };

  socket.on(event, listener);
};
