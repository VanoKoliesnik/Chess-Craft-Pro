import { ICoordinate } from "@common/types";
import { pickRandomElement } from "@common/utils";

import { Game } from "@entities";
import { QueensBattleRules } from "@rules";

const game = new Game({
  Rules: QueensBattleRules,
});

// todo: should be moved to game rules

let coordinates: ICoordinate = { x: 4, y: 5 };

setInterval(moveFigure, 1000);

function moveFigure() {
  // const figure = game.getFigure(coordinates);

  // if (!figure) {
  //   process.exit();
  // }

  const availableMoves = game.getAvailableMoves(coordinates);

  if (!availableMoves.length) {
    process.exit();
  }

  // const nextMoveCoordinates = coordinatesToMove.pop();
  const nextMoveCoordinates = pickRandomElement(availableMoves);

  if (!nextMoveCoordinates) {
    process.exit();
  }

  const { success } = game.moveFigure(coordinates, nextMoveCoordinates);

  if (success) {
    coordinates = nextMoveCoordinates;
  } else {
    setTimeout(moveFigure, 100);
  }
}
