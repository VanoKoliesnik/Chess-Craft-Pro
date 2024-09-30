import { CellColor, CellType, Event } from "@common/enums";
import { AppEventEmitter, Coordinates, EventEmitter } from "@common/shared";
import { CoordinatesKey, ICoordinate } from "@common/types";

import { Figure } from "@entities";

export class Cell {
  figure: Figure;

  type: CellType;

  readonly coordinates: ICoordinate;

  private readonly eventEmitter: EventEmitter;

  constructor(coordinates: ICoordinate, type: CellType, figure?: Figure) {
    this.eventEmitter = AppEventEmitter.getInstance();

    this.coordinates = coordinates;
    this.type = type;

    this.figure = figure || null;
  }

  get isEmpty(): boolean {
    return this.figure === null;
  }

  get coordinatesKey(): CoordinatesKey {
    return Coordinates.getKey({ x: this.coordinates.x, y: this.coordinates.y });
  }

  get color(): CellColor {
    return CellColor[this.type];
  }

  set setType(nextType: CellType) {
    switch (this.type) {
      case CellType.White:
      case CellType.Blue:
        this.type = nextType;
        break;

      case CellType.Black:
        break;
    }
  }

  set setFigure(figure: Figure) {
    this.figure = figure || null;

    if (this.isEmpty) {
      this.type = CellType.Black;
    } else {
      this.type = CellType.White;

      this.eventEmitter.emit(Event.SetFigureOnCell, figure, this);
    }
  }
}
