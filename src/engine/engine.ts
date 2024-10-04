import { VoidFunction } from "@common/types";

import { Rules } from "@rules";

import { PainterEngine } from "./painter";
import { RenderEngine } from "./render";
import { UpdateEngine } from "./update";

type EngineConfig = {
  updateState: VoidFunction;
  rules: Rules;
};

export class Engine {
  constructor({ updateState, rules }: EngineConfig) {
    const painter = new PainterEngine({ rules });

    new UpdateEngine(updateState);
    new RenderEngine(painter.draw.bind(painter));
  }
}
