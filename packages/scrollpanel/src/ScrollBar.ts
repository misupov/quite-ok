import { EventEmitter } from "eventemitter3";

type Direction = "h" | "v";

export type ScrollEvent = {
  offset: number;
};

function createTrack(dir: Direction) {
  const track = document.createElement("div");
  track.style.position = "absolute";
  track.style.background = "#8883";
  track.style.borderRadius = "10px";
  track.style.display = "grid";
  if (dir === "v") {
    track.style.top = "0";
    track.style.right = "0";
    track.style.bottom = "0";
    track.style.width = "10px";
  } else {
    track.style.bottom = "0";
    track.style.left = "0";
    track.style.right = "0";
    track.style.height = "10px";
  }
  return track;
}

function createThumb(dir: Direction) {
  const thumb = document.createElement("div");
  thumb.style.background = "red";
  thumb.style.borderRadius = "10px";
  return thumb;
}

export class ScrollBar {
  private readonly container: HTMLElement;
  private readonly track: HTMLDivElement;
  private readonly thumb: HTMLDivElement;
  private readonly dir: Direction;
  private readonly emitter = new EventEmitter();

  constructor(container: HTMLElement, dir: Direction) {
    this.dir = dir;
    const track = createTrack(dir);
    const thumb = createThumb(dir);

    thumb.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      const clientRect = thumb.getBoundingClientRect();
      let clickOffset: number;
      if (dir === "v") {
        clickOffset = (e.clientY - clientRect.y) / clientRect.height;
      } else {
        clickOffset = (e.clientX - clientRect.x) / clientRect.width;
      }
      const onPointerUp = () => {
        window.removeEventListener("pointermove", onPointerMove);
      };
      const onPointerMove = (e: PointerEvent) => {
        const trackRect = track.getBoundingClientRect();
        const thumbRect = thumb.getBoundingClientRect();
        let moveOffset: number;
        let trackRectStart: number;
        let trackSize: number;
        let thumbSize: number;
        if (dir === "v") {
          moveOffset = e.clientY;
          trackRectStart = trackRect.y;
          trackSize = trackRect.height;
          thumbSize = thumbRect.height;
        } else {
          moveOffset = e.clientX;
          trackRectStart = trackRect.x;
          trackSize = trackRect.width;
          thumbSize = thumbRect.width;
        }
        const thumbSizeStart = thumbSize * clickOffset;
        const offset =
          (moveOffset - trackRectStart - thumbSizeStart) /
          (trackSize - thumbSize);
        this.emitter.emit("scroll", { offset } satisfies ScrollEvent);
      };
      window.addEventListener("pointerup", onPointerUp, { once: true });
      window.addEventListener("pointermove", onPointerMove);
    });

    track.appendChild(document.createElement("div"));
    track.appendChild(thumb);
    track.appendChild(document.createElement("div"));
    container.appendChild(track);
    this.container = container;
    this.track = track;
    this.thumb = thumb;
  }

  destroy() {
    this.container.removeChild(this.track);
  }

  on(event: "scroll", callback: (e: ScrollEvent) => void): void;
  on(event: string, callback: (e: any) => void) {
    this.emitter.on(event, callback);
  }

  off(event: "scroll", callback: (e: ScrollEvent) => void): void;
  off(event: string, callback: (e: any) => void) {
    this.emitter.off(event, callback);
  }

  updateGeometry(
    viewportOffset: number,
    scrollSize: number,
    viewportSize: number,
    twoAxis: boolean
  ) {
    this.track.style.opacity = scrollSize <= viewportSize ? "0" : "1";
    viewportOffset = Math.min(viewportOffset, scrollSize - viewportSize);
    let offset = viewportOffset / scrollSize;
    offset = Math.max(offset, 0);

    const size = viewportSize / scrollSize;

    const gridTemplate = `${viewportOffset}fr max(40px, ${size * 100}%) ${
      scrollSize - (viewportOffset + viewportSize)
    }fr`;
    const trackPadding = twoAxis ? "10px" : "0";
    if (this.dir === "v") {
      this.track.style.gridTemplateColumns = "auto";
      this.track.style.gridTemplateRows = gridTemplate;
      this.track.style.bottom = trackPadding;
    } else {
      this.track.style.gridTemplateColumns = gridTemplate;
      this.track.style.gridTemplateRows = "auto";
      this.track.style.right = trackPadding;
    }
  }
}
