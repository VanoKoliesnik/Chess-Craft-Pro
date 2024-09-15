import { Game } from "./game";

const game = new Game();

setTimeout(() => {
  game.moveFigure({ x: 4, y: 5 }, { x: 7, y: 5 });
}, 2000);

setTimeout(() => {
  game.moveFigure({ x: 7, y: 5 }, { x: 3, y: 1 });
}, 5000);

setTimeout(() => {
  game.moveFigure({ x: 3, y: 1 }, { x: 5, y: 1 });
}, 7000);
