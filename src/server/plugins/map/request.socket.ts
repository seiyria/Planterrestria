
import { Map } from '../../../shared/models/map';

export const event = 'plugin:map:request';
export const operate = ({ socket, respond }) => {
  const listener = () => {
    respond({
      update: 'Map',
      data: new Map()
    })
  };

  socket.on(event, listener);
};
