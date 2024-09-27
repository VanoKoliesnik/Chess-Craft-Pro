import { DestinationCell, IResultSuccess, OriginCell } from "@common/types";

import { Figure } from "@entities";

export type X = number;
export type Y = number;

export interface ICoordinate {
  x: X;
  y: Y;
}

export interface ISizeCoordinate {
  x: X;
  y: Y;
}

export interface IVectorSegment {
  zeroPoint: ICoordinate;
  destinationPoint: ICoordinate;
}

export type MoveResult = ICoordinate & IResultSuccess;
export type MoveHorizontalResult = Pick<ICoordinate, "x"> & IResultSuccess;
export type MoveVerticalResult = Pick<ICoordinate, "y"> & IResultSuccess;

export type MoveFigureResult = IResultSuccess & {
  cells: [OriginCell, DestinationCell];
  figure: Figure;
};

export type CoordinatesKey = `${ICoordinate["x"]}_${ICoordinate["y"]}`;
export type CoordinatesSet = Set<CoordinatesKey>;
