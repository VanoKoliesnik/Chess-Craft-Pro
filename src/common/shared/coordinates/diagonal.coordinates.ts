import { ICoordinate } from "@common/types";

import { Holocron } from "@entities";

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
      i >= Holocron.getInstance().minX && j >= Holocron.getInstance().minY;
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
      i >= Holocron.getInstance().minX && j <= Holocron.getInstance().maxY;
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
      i <= Holocron.getInstance().maxY && j >= Holocron.getInstance().minY;
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
      i <= Holocron.getInstance().maxX && j <= Holocron.getInstance().maxY;
      i++, j++
    ) {
      moves.push({ x: i, y: j });
    }

    return moves;
  }
}
