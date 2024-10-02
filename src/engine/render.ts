export class RenderEngine {
  private intervalId: NodeJS.Timeout = null;
  private prevFrame: string = null;

  private readonly renderFrame: () => string;
  private readonly updateState: () => void;

  constructor(updateState: () => void, renderFrame: () => string) {
    this.renderFrame = renderFrame;
    this.updateState = updateState;
    this.start();
  }

  start(fps: number = 1) {
    this.intervalId = setInterval(() => {
      this.updateState();
      const nextFrame = this.renderFrame();

      if (this.prevFrame === nextFrame) {
        return;
      }

      this.prevFrame = nextFrame;

      process.stdout.write("\x1Bc");
      process.stdout.write(nextFrame);
    }, 1_000 / fps);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
