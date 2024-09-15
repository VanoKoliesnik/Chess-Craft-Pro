import { CellType, Event } from "../common/enums";
import { AppEventEmitter, EventEmitter } from "../common/shared";
import { CoordinatesKey, ICoordinates } from "../common/types";
import { Figure } from "../figures";

export class Cell {
  figure: Figure = null;
  type: CellType;

  readonly coordinates: ICoordinates;

  private readonly eventEmitter: EventEmitter;

  constructor(coordinates: ICoordinates, type: CellType, figure?: Figure) {
    this.eventEmitter = AppEventEmitter.getInstance();

    this.coordinates = coordinates;
    this.type = type;

    if (figure) {
      this.figure = figure;
    }
  }

  get isEmpty(): boolean {
    return this.figure === null;
  }

  get coordinatesKey(): CoordinatesKey {
    return `${this.coordinates.x}_${this.coordinates.y}`;
  }

  get color(): string {
    switch (this.type) {
      case CellType.White:
        return "⬜";

      case CellType.Black:
        return "⬛";

      case CellType.Blue:
        return "🟦";
    }
  }

  set setFigure(figure: Figure) {
    this.eventEmitter.emit(Event.AddFigureToBoard, figure, this);

    if (figure) {
      this.type = CellType.Black;
    } else {
      this.type = CellType.White;
    }

    this.figure = figure;
  }
}
