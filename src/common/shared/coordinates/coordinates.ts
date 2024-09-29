import { CellType } from "@common/enums";
import {
  CoordinatesKey,
  ICoordinate,
  MoveHorizontalResult,
  MoveResult,
  MoveVerticalResult,
  X,
  Y,
} from "@common/types";
import { genKey } from "@common/utils";

import { Board, Cell } from "@entities";

export interface IIsMoveForwardAvailableProps {
  cell: Cell;
  row: Cell[];
  delta: ICoordinate;
}

export class Coordinates {
  private readonly sizeX: X;
  private readonly sizeY: Y;

  constructor(sizeX: X, sizeY: Y) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
  }

  static getKey({ x, y }: ICoordinate): CoordinatesKey {
    return genKey(x, y) as CoordinatesKey;
  }

  static makeSetList(coordinates: ICoordinate[]): Set<CoordinatesKey> {
    return new Set(coordinates.map(Coordinates.getKey));
  }

  static makeMatrix(
    initialCoordinates: ICoordinate,
    destinationCoordinates: ICoordinate,
    excludedPoints: ICoordinate[] = []
  ): ICoordinate[] {
    const xStart = Math.min(initialCoordinates.x, destinationCoordinates.x);
    const xEnd = Math.max(initialCoordinates.x, destinationCoordinates.x);

    const yStart = Math.min(initialCoordinates.y, destinationCoordinates.y);
    const yEnd = Math.max(initialCoordinates.y, destinationCoordinates.y);

    const pointsToExclude = Coordinates.makeSetList(excludedPoints);

    const points: ICoordinate[] = [];

    for (let x = xStart; x <= xEnd; x++) {
      for (let y = yStart; y <= yEnd; y++) {
        if (!pointsToExclude.has(Coordinates.getKey({ x, y }))) {
          points.push({ x, y });
        }
      }
    }

    return points;
  }

  static delta(
    firstCoordinate: ICoordinate,
    secondCoordinate: ICoordinate
  ): ICoordinate {
    return {
      x: firstCoordinate.x - secondCoordinate.x,
      y: firstCoordinate.y - secondCoordinate.y,
    };
  }

  static deltaAbsolute(
    firstCoordinate: ICoordinate,
    secondCoordinate: ICoordinate
  ): ICoordinate {
    const { x, y } = this.delta(firstCoordinate, secondCoordinate);
    return { x: Math.abs(x), y: Math.abs(y) };
  }

  static areSame(
    firstCoordinate: ICoordinate,
    secondCoordinate: ICoordinate
  ): boolean {
    return (
      Coordinates.getKey(firstCoordinate) ===
      Coordinates.getKey(secondCoordinate)
    );
  }

  // todo: remove. It should be controlled by Rules
  getVerticalMoves(
    { x, y }: ICoordinate,
    limit: number,
    maxCellsToJump = Infinity
  ): ICoordinate[] {
    const moves: ICoordinate[] = [];

    if (limit <= 0) {
      return moves;
    }

    const safeLimit = Math.min(limit, this.sizeY);
    const safeMaxCellsJump = Math.min(maxCellsToJump, this.sizeX);

    const board = Board.getInstance();

    let cellsToJumpOver = 0;

    for (let i = 0; i < safeLimit; i++) {
      const result = this.moveUp(y + i);

      const cell = board.getCell({ y: result.y, x });

      if (!result.success) {
        break;
      }

      if (cell && cell.getType !== CellType.Black) {
        moves.push({ x, y: result.y });
      } else {
        cellsToJumpOver++;
      }

      if (cellsToJumpOver > safeMaxCellsJump) {
        break;
      }
    }

    cellsToJumpOver = 0;

    for (let i = 0; i < safeLimit; i++) {
      const result = this.moveDown(y - i);

      const cell = board.getCell({ y: result.y, x });

      if (!result.success) {
        break;
      }

      if (cell && cell.getType !== CellType.Black) {
        moves.push({ x, y: result.y });
      } else {
        cellsToJumpOver++;
      }

      if (cellsToJumpOver > safeMaxCellsJump) {
        break;
      }
    }

    return moves;
  }

  // todo: remove. It should be controlled by Rules
  getHorizontalMoves(
    { x, y }: ICoordinate,
    limit: number,
    maxCellsToJump = Infinity
  ): ICoordinate[] {
    const moves: ICoordinate[] = [];

    if (limit <= 0) {
      return moves;
    }

    const safeLimit = Math.min(limit, this.sizeX);
    const safeMaxCellsJump = Math.min(maxCellsToJump, this.sizeX);

    const board = Board.getInstance();

    let cellsToJumpOver = 0;

    for (let i = x; i <= safeLimit; i++) {
      const result = this.moveRight(i);

      const cell = board.getCell({ x: result.x, y });

      if (!result.success) {
        break;
      }

      if (cell && cell.getType !== CellType.Black) {
        moves.push({ x: result.x, y });
      } else {
        cellsToJumpOver++;
      }

      if (cellsToJumpOver > safeMaxCellsJump) {
        break;
      }
    }

    cellsToJumpOver = 0;

    for (let i = x - 1; i >= 0; i--) {
      const result = this.moveLeft(x - i);

      const cell = board.getCell({ x: result.x, y });

      if (!result.success) {
        break;
      }

      if (cell && cell.getType !== CellType.Black) {
        moves.push({ x: result.x, y });
      } else {
        cellsToJumpOver++;
      }

      if (cellsToJumpOver > safeMaxCellsJump) {
        break;
      }
    }

    return moves;
  }

  // todo: remove. It should be controlled by Rules
  getDiagonalMoves(
    { x, y }: ICoordinate,
    limit: number,
    maxCellsToJump = Infinity
  ): MoveResult[] {
    const moves: MoveResult[] = [];

    if (limit <= 0) {
      return moves;
    }

    const safeLimit = Math.min(limit, Math.max(this.sizeX, this.sizeY));
    const safeMaxCellsJump = Math.min(maxCellsToJump, this.sizeX);

    const board = Board.getInstance();

    let cellsToJumpOverUpRight = 0;
    let cellsToJumpOverUpLeft = 0;
    let cellsToJumpOverDownRight = 0;
    let cellsToJumpOverDownLeft = 0;

    for (let i = 0; i < safeLimit; i++) {
      const upRight = this.moveUpRight(x + i, y + i);
      const upLeft = this.moveUpLeft(x - i, y + i);
      const downRight = this.moveDownRight(x + i, y - i);
      const downLeft = this.moveDownLeft(x - i, y - i);

      const [upRightCell, upLeftCell, downRightCell, downLeftCell] =
        board.getCells([upRight, upLeft, downRight, downLeft]);

      if (upRight.success) {
        if (
          upRightCell &&
          upRightCell.getType !== CellType.Black &&
          cellsToJumpOverUpRight <= safeMaxCellsJump
        ) {
          moves.push(upRight);
        } else {
          cellsToJumpOverUpRight++;
        }
      }

      if (upLeft.success) {
        if (
          upLeftCell &&
          upLeftCell.getType !== CellType.Black &&
          cellsToJumpOverUpLeft <= safeMaxCellsJump
        ) {
          moves.push(upLeft);
        } else {
          cellsToJumpOverUpLeft++;
        }
      }

      if (downRight.success) {
        if (
          downRightCell &&
          downRightCell.getType !== CellType.Black &&
          cellsToJumpOverDownRight <= safeMaxCellsJump
        ) {
          moves.push(downRight);
        } else {
          cellsToJumpOverDownRight++;
        }
      }

      if (downLeft.success) {
        if (
          downLeftCell &&
          downLeftCell.getType !== CellType.Black &&
          cellsToJumpOverDownLeft <= safeMaxCellsJump
        ) {
          moves.push(downLeft);
        } else {
          cellsToJumpOverDownLeft++;
        }
      }
    }

    return moves;
  }

  moveUp(y: Y): MoveVerticalResult {
    let nextY: Y = y;
    let success = false;

    if (y + 1 <= this.sizeY) {
      nextY = y + 1;
      success = true;
    }

    return { y: nextY, success };
  }

  moveDown(y: Y): MoveVerticalResult {
    let nextY: Y = y;
    let success = false;

    if (y - 1 >= 0) {
      nextY = y - 1;
      success = true;
    }

    return { y: nextY, success };
  }

  moveRight(x: X): MoveHorizontalResult {
    let nextX: X = x;
    let success = false;

    if (x + 1 <= this.sizeX) {
      nextX = x + 1;
      success = true;
    }

    return { x: nextX, success };
  }

  moveLeft(x: X): MoveHorizontalResult {
    let nextX: X = x;
    let success = false;

    if (x - 1 >= 0) {
      nextX = x - 1;
      success = true;
    }

    return { x: nextX, success };
  }

  moveUpRight(x: X, y: Y): MoveResult {
    let nextX: X = x;
    let nextY: Y = y;
    let success = false;

    if (x + 1 <= this.sizeX && y + 1 <= this.sizeY) {
      nextX = x + 1;
      nextY = y + 1;
      success = true;
    }

    return { x: nextX, y: nextY, success };
  }

  moveUpLeft(x: X, y: Y): MoveResult {
    let nextX: X = x;
    let nextY: Y = y;
    let success = false;

    if (x - 1 >= 0 && y + 1 <= this.sizeY) {
      nextX = x - 1;
      nextY = y + 1;
      success = true;
    }

    return { x: nextX, y: nextY, success };
  }

  moveDownRight(x: X, y: Y): MoveResult {
    let nextX: X = x;
    let nextY: Y = y;
    let success = false;

    if (x + 1 <= this.sizeX && y - 1 >= 0) {
      nextX = x + 1;
      nextY = y - 1;
      success = true;
    }

    return { x: nextX, y: nextY, success };
  }

  moveDownLeft(x: X, y: Y): MoveResult {
    let nextX: X = x;
    let nextY: Y = y;
    let success = false;

    if (x - 1 >= 0 && y - 1 >= 0) {
      nextX = x - 1;
      nextY = y - 1;
      success = true;
    }

    return { x: nextX, y: nextY, success };
  }
}
