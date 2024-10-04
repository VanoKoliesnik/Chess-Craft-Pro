export class RenderEngine {
  private intervalId: NodeJS.Timeout = null;
  private prevFrame: string = null;

  private readonly renderFrame: () => string;

  constructor(renderFrame: () => string) {
    this.renderFrame = renderFrame;
    this.start();
  }

  start(fps: number = 2) {
    this.intervalId = setInterval(() => {
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
