import { CellColor, CellType, Event } from "@common/enums";
import { AppEventEmitter, Coordinates, EventEmitter } from "@common/shared";
import { CoordinatesKey, ICoordinate } from "@common/types";
import { Figure } from "@entities";

export class Cell {
  figure: Figure = null;

  private type: CellType;

  readonly coordinates: ICoordinate;

  private readonly eventEmitter: EventEmitter;

  constructor(coordinates: ICoordinate, type: CellType, figure?: Figure) {
    this.eventEmitter = AppEventEmitter.getInstance();

    this.coordinates = coordinates;
    this.type = type;

    if (figure) {
      this.figure = figure;
    }
  }

  get getType(): CellType {
    return this.type;
  }

  get canAcceptFigure(): boolean {
    return !this.isEmpty || this.getType !== CellType.Black;
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
    this.eventEmitter.emit(Event.AddFigureToBoard, figure, this);

    if (figure) {
      this.type = CellType.Black;
    } else {
      this.type = CellType.White;
    }

    this.figure = figure;
  }
}
