import { ICoordinates, MoveHorizontalResult, MoveResult, MoveVerticalResult, X, Y } from "../types";

export class Coordinates {
  private readonly sizeX: X;
  private readonly sizeY: Y;

  constructor(sizeX: X, sizeY: Y) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
  }

  getVerticalMoves({ x, y }: ICoordinates, limit = 256): ICoordinates[] {
    const moves: ICoordinates[] = [];

    if (limit <= 0) {
      return moves;
    }

    for (let i = 0; i < Math.min(limit, 256); i++) {
      const result = this.moveUp(y + i);

      if (result.success) {
        moves.push({ x, y: result.y });
      } else {
        break;
      }
    }

    for (let i = 0; i < limit; i++) {
      const result = this.moveDown(y - i);

      if (result.success) {
        moves.push({ x, y: result.y });
      } else {
        break;
      }
    }

    return moves;
  }

  getHorizontalMoves({ x, y }: ICoordinates, limit = 256): ICoordinates[] {
    const moves: ICoordinates[] = [];

    if (limit <= 0) {
      return moves;
    }

    for (let i = 0; i < Math.min(limit, 256); i++) {
      const result = this.moveRight(x + i);

      if (result.success) {
        moves.push({ x: result.x, y });
      } else {
        break;
      }
    }

    for (let i = 0; i < limit; i++) {
      const result = this.moveLeft(x - i);

      if (result.success) {
        moves.push({ x: result.x, y });
      } else {
        break;
      }
    }

    return moves;
  }

  getDiagonalMoves({ x, y }: ICoordinates, limit = 256): MoveResult[] {
    const moves: MoveResult[] = [];

    if (limit <= 0) {
      return moves;
    }

    for (let i = 0; i < Math.min(limit, 256); i++) {
      const upRight = this.moveUpRight(x + i, y + i);
      const upLeft = this.moveUpLeft(x - i, y + i);
      const downRight = this.moveDownRight(x + i, y - i);
      const downLeft = this.moveDownLeft(x - i, y - i);

      if (upRight.success) {
        moves.push(upRight);
      }
      if (upLeft.success) {
        moves.push(upLeft);
      }
      if (downRight.success) {
        moves.push(downRight);
      }
      if (downLeft.success) {
        moves.push(downLeft);
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
