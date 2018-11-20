import initGame from './lib/game';
import Highscore from './lib/highscore';

const PLAY_TIME = 10;

document.addEventListener('DOMContentLoaded', () => {
  initGame(PLAY_TIME);

  const highscore = new Highscore();
  highscore.load();
});