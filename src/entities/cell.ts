import { CellColor, CellType } from "@common/enums";
import { AppEventEmitter, Coordinates, EventName } from "@common/shared";
import { CoordinatesKey, ICoordinate } from "@common/types";

import { Holocron } from "@entities";

export class Cell {
  type: CellType;

  readonly coordinates: ICoordinate;

  constructor(coordinates: ICoordinate, type: CellType) {
    this.coordinates = coordinates;
    this.type = type;

    AppEventEmitter.getInstance().emit(EventName.SpawnCell, this);
  }

  get isEmpty(): boolean {
    return (
      Holocron.getInstance().getFigureByCell({
        coordinates: this.coordinates,
      }) === null
    );
  }

  get coordinatesKey(): CoordinatesKey {
    return Coordinates.getKey({ x: this.coordinates.x, y: this.coordinates.y });
  }

  get color(): CellColor {
    return CellColor[this.type];
  }

  // todo: move this logic to rules
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
}
