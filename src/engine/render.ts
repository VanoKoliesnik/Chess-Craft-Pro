export class RenderEngine {
  private intervalId: NodeJS.Timeout = null;
  private readonly renderFn: () => string;
  private prevFrame: string = null;

  constructor(renderFn: () => string) {
    this.renderFn = renderFn;
  }

  start(fps: number = 1) {
    this.intervalId = setInterval(() => {
      const nextFrame = this.renderFn();

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
