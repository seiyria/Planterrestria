
import { Map } from '../../../shared/models/map';

export const event = 'plugin:map:request';
const map = new Map();
export const operate = ({ socket, respond }) => {
  const listener = () => {
    respond({
      update: 'Map',
      data: map.exportPolygons()
    })
  };

  socket.on(event, listener);
};
