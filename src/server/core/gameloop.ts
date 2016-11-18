
import { GameState } from './gamestate';

export const State = new GameState();

setInterval(() => {
  console.log('Game loop iteration.');
}, 1000);
