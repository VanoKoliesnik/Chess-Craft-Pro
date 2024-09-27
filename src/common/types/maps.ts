import { Cell, Figure, Player } from "@entities";

export type FiguresMap = Map<Figure["id"], Figure>;
export type CellsMap = Map<Cell["coordinatesKey"], Cell>;
export type PlayersMap = Map<Player["id"], Player>;
