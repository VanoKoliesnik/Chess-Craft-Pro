import { UUID } from "crypto";

import { Cell } from "@entities";

import { ICoordinate } from "./coordinates";

export interface IResultSuccess {
  success: boolean;
}

export type OriginCell = Cell;
export type DestinationCell = Cell;

export type Constructable<T, K> = {
  new (...args: K[]): T;
};

export type EntitySearchArgsById = { id: UUID };
export type EntitySearchArgsByCoordinates = { coordinates: ICoordinate };
export type EntitySearchArgsByMultipleCoordinates = {
  coordinates: ICoordinate[];
};

export type EntitySearchArgs = Partial<
  EntitySearchArgsById & EntitySearchArgsByCoordinates
>;
