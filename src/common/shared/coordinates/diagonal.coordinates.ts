import { ICoordinate } from "@common/types";

import { Board } from "@entities";

export class DiagonalCoordinates {
  static getPoints(initialCoordinates: ICoordinate): ICoordinate[] {
    return [
      ...this.getUpperLeftPoints(initialCoordinates),
      ...this.getUpperRightPoints(initialCoordinates),
      ...this.getLowerLeftPoints(initialCoordinates),
      ...this.getLowerRightPoints(initialCoordinates),
    ];
  }

  static getUpperLeftPoints({ x, y }: ICoordinate): ICoordinate[] {
    const moves: ICoordinate[] = [];

    for (
      let i = x - 1, j = y - 1;
      i >= Board.getInstance().minX && j >= Board.getInstance().minY;
      i--, j--
    ) {
      moves.push({ x: i, y: j });
    }

    return moves;
  }

  static getLowerLeftPoints({ x, y }: ICoordinate): ICoordinate[] {
    const moves: ICoordinate[] = [];

    for (
      let i = x - 1, j = y + 1;
      i >= Board.getInstance().minX && j <= Board.getInstance().maxY - 1;
      i--, j++
    ) {
      moves.push({ x: i, y: j });
    }

    return moves;
  }

  static getUpperRightPoints({ x, y }: ICoordinate): ICoordinate[] {
    const moves: ICoordinate[] = [];

    for (
      let i = x + 1, j = y - 1;
      i <= Board.getInstance().maxY && j >= Board.getInstance().minY;
      i++, j--
    ) {
      moves.push({ x: i, y: j });
    }

    return moves;
  }

  static getLowerRightPoints({ x, y }: ICoordinate): ICoordinate[] {
    const moves: ICoordinate[] = [];

    for (
      let i = x + 1, j = y + 1;
      i <= Board.getInstance().maxX && j <= Board.getInstance().maxY - 1;
      i++, j++
    ) {
      moves.push({ x: i, y: j });
    }

    return moves;
  }
}
