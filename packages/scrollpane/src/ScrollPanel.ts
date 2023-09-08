import { EventEmitter } from "eventemitter3";
import iconBoth from "./scroll-icons/both.svg";
import iconVertical from "./scroll-icons/vertical.svg";
import iconHorizontal from "./scroll-icons/horizontal.svg";
import { getCursorByAngle, hypoth, startRafAnimation } from "./utils";
import { ScrollBar } from "./ScrollBar";

type Point = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

export class ScrollPanel {
  private readonly iconBothUrl: string;
  private readonly iconVerticalUrl: string;
  private readonly iconHorizontalUrl: string;

  private readonly container: HTMLElement;
  private readonly target: HTMLElement;
  private readonly vscroll: ScrollBar;
  private readonly hscroll: ScrollBar;
  private readonly resizeObserver: ResizeObserver;
  private readonly emitter = new EventEmitter();

  private scrollSize?: Size;
  private viewportSize?: Size;
  private viewportOffset: Point = { x: 0, y: 0 };

  constructor(container: HTMLElement, target: HTMLElement) {
    container.style.position = "relative";
    this.vscroll = new ScrollBar(container, "v");
    this.hscroll = new ScrollBar(container, "h");

    container.addEventListener("wheel", this.onWheel);
    container.addEventListener("mousedown", this.onMouseDown);
    const resizeObserver = new ResizeObserver(this.onTargetResize);
    resizeObserver.observe(target);
    this.container = container;
    this.target = target;
    this.resizeObserver = resizeObserver;

    this.iconBothUrl = iconBoth;
    this.iconVerticalUrl = URL.createObjectURL(
      new Blob([iconVertical], { type: "image/svg+xml" })
    );
    this.iconHorizontalUrl = URL.createObjectURL(
      new Blob([iconHorizontal], { type: "image/svg+xml" })
    );
  }

  destroy() {
    this.resizeObserver.disconnect();
    this.vscroll.destroy();
    this.hscroll.destroy();
    this.container.removeEventListener("wheel", this.onWheel);
    this.container.removeEventListener("mousedown", this.onMouseDown);

    URL.revokeObjectURL(this.iconBothUrl);
    URL.revokeObjectURL(this.iconVerticalUrl);
    URL.revokeObjectURL(this.iconHorizontalUrl);
  }

  on(event: "viewportchange", callback: (e: any) => void): void;
  on(event: string, callback: (e: unknown) => void) {
    this.emitter.on(event, callback);
  }

  off(event: "viewportchange", callback: (e: any) => void): void;
  off(event: string, callback: (e: unknown) => void) {
    this.emitter.off(event, callback);
  }

  setScrollArea(width: number, height: number) {
    this.scrollSize = { width, height };
    this.refreshThumbs();
  }

  refreshThumbs = () => {
    if (this.viewportSize && this.scrollSize) {
      this.hscroll.updateGeometry(
        this.viewportOffset.x,
        this.scrollSize.width,
        this.viewportSize.width
      );
      this.vscroll.updateGeometry(
        this.viewportOffset.y,
        this.scrollSize.height,
        this.viewportSize.height
      );
    }
  };

  onTargetResize = (entries: ResizeObserverEntry[]) => {
    const lastEntry = entries.at(-1);
    if (lastEntry) {
      this.viewportSize = {
        width: lastEntry.contentRect.width,
        height: lastEntry.contentRect.height,
      };
    }
    this.refreshThumbs();
  };

  onWheel = (ev: WheelEvent) => {
    if (!this.scrollSize || !this.viewportSize) {
      return;
    }

    let newX = this.viewportOffset.x + ev.deltaX;
    newX = Math.min(newX, this.scrollSize.width - this.viewportSize.width);
    newX = Math.max(newX, 0);

    let newY = this.viewportOffset.y + ev.deltaY;
    newY = Math.min(newY, this.scrollSize.height - this.viewportSize.height);
    newY = Math.max(newY, 0);

    this.viewportOffset.x = newX;
    this.viewportOffset.y = newY;
    this.refreshThumbs();
    ev.preventDefault();
    // todo: call ev.preventDefault() if no further scrolling is possible
  };

  onMouseDown = (ev: MouseEvent) => {
    if (ev.button === 1) {
      ev.preventDefault();
      const startX = ev.clientX;
      const startY = ev.clientY;
      let deltaX = 0;
      let deltaY = 0;
      const dataUrl = `url("${this.iconBothUrl}")`;
      const fullScreenDiv = document.createElement("div");
      fullScreenDiv.style.transform = "translateZ(0px)";
      fullScreenDiv.style.position = "fixed";
      fullScreenDiv.style.inset = "0";
      fullScreenDiv.style.zIndex = "2147483647";
      fullScreenDiv.style.backgroundRepeat = "no-repeat";
      fullScreenDiv.style.backgroundImage = dataUrl;
      fullScreenDiv.style.backgroundSize = "26px 26px";
      fullScreenDiv.style.backgroundPosition = `${ev.clientX - 13}px ${
        ev.clientY - 13
      }px`;
      const stopAnimation = startRafAnimation(() => {
        this.viewportOffset.x += deltaX;
        this.viewportOffset.y += deltaY;
        this.refreshThumbs();
      });
      fullScreenDiv.onmousemove = (e) => {
        deltaX = (e.clientX - startX) / 10;
        deltaY = (e.clientY - startY) / 10;
        const rad = Math.atan2(-deltaY, deltaX);
        if (hypoth(deltaX, deltaY) > 1) {
          fullScreenDiv.style.cursor = getCursorByAngle(rad);
        } else {
          fullScreenDiv.style.cursor = "default";
        }
      };
      const body = document.body ? document.body : document.documentElement;
      body.appendChild(fullScreenDiv);
      setTimeout(() =>
        document.addEventListener(
          "mousedown",
          () => {
            body.removeChild(fullScreenDiv);
            stopAnimation();
          },
          { once: true }
        )
      );
      window.addEventListener(
        "blur",
        () => {
          body.removeChild(fullScreenDiv);
          stopAnimation();
        },
        { once: true }
      );
    }
  };
}
