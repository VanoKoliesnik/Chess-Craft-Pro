import { IResult } from "./common";

export type X = number;
export type Y = number;

export interface ICoordinates {
  x: X;
  y: Y;
}

export type MoveResult = ICoordinates & IResult;
export type MoveHorizontalResult = Pick<ICoordinates, "x"> & IResult;
export type MoveVerticalResult = Pick<ICoordinates, "y"> & IResult;

export type CoordinatesKey = `${ICoordinates["x"]}_${ICoordinates["y"]}`;
export type CoordinatesSet = Set<CoordinatesKey>;
