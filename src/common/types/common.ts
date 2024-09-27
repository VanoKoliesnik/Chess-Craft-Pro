import { Cell } from "@entities";

export interface IResultSuccess {
  success: boolean;
}

export type OriginCell = Cell;
export type DestinationCell = Cell;

export type Constructable<T, K> = {
  new (...args: K[]): T;
};
