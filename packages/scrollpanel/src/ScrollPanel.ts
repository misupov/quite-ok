import { EventEmitter } from "eventemitter3";
import iconBoth from "./scroll-icons/both.svg";
import iconVertical from "./scroll-icons/vertical.svg";
import iconHorizontal from "./scroll-icons/horizontal.svg";
import { getCursorByAngle, hypoth, startRafAnimation } from "./utils";
import { ScrollBar } from "./ScrollBar";

export type ViewportChangeEvent = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

export class ScrollPanel {
  private readonly container: HTMLElement;
  private readonly target: HTMLElement;
  private readonly vscroll: ScrollBar;
  private readonly hscroll: ScrollBar;
  private readonly resizeObserver: ResizeObserver;
  private readonly emitter = new EventEmitter();

  private scrollSize: Size = { width: 0, height: 0 };
  private viewportSize: Size = { width: 0, height: 0 };
  private viewportOffset: Point = { x: 0, y: 0 };

  constructor(container: HTMLElement, target: HTMLElement) {
    container.style.position = "relative";
    this.vscroll = new ScrollBar(container, "v");
    this.hscroll = new ScrollBar(container, "h");
    this.vscroll.on("scroll", (e) => {
      this.scrollTo(this.viewportOffset.x, e.offset * (this.scrollSize.height - this.viewportSize.height));
      // this.refreshThumbs();
    });
    this.hscroll.on("scroll", (e) => {
      this.scrollTo(e.offset * (this.scrollSize.width - this.viewportSize.width), this.viewportOffset.y);
      // this.refreshThumbs();
    });

    container.addEventListener("wheel", this.onWheel);
    container.addEventListener("pointerdown", this.onPointerDown);
    container.addEventListener("touchstart", this.onTouchStart);
    const resizeObserver = new ResizeObserver(this.onTargetResize);
    resizeObserver.observe(target);
    this.container = container;
    this.target = target;
    this.resizeObserver = resizeObserver;
  }

  destroy() {
    this.resizeObserver.disconnect();
    this.vscroll.destroy();
    this.hscroll.destroy();
    this.container.removeEventListener("wheel", this.onWheel);
    this.container.removeEventListener("pointerdown", this.onPointerDown);
  }

  on(event: "viewportchange", callback: (e: ViewportChangeEvent) => void): void;
  on(event: string, callback: (e: any) => void) {
    this.emitter.on(event, callback);
  }

  off(event: "viewportchange", callback: (e: ViewportChangeEvent) => void): void;
  off(event: string, callback: (e: any) => void) {
    this.emitter.off(event, callback);
  }

  setScrollArea(width: number, height: number) {
    this.scrollSize = { width, height };
    this.scrollBy(0, 0);
    this.refreshThumbs();
  }

  refreshThumbs = () => {
    const showHScroll = this.scrollSize.width > this.viewportSize.width;
    const showVScroll = this.scrollSize.height > this.viewportSize.height;
    this.hscroll.updateGeometry(this.viewportOffset.x, this.scrollSize.width, this.viewportSize.width, showVScroll);
    this.vscroll.updateGeometry(this.viewportOffset.y, this.scrollSize.height, this.viewportSize.height, showHScroll);
  };

  onTargetResize = (entries: ResizeObserverEntry[]) => {
    const lastEntry = entries.at(-1);
    if (lastEntry) {
      const prevViewportSize = this.viewportSize;
      this.viewportSize = {
        width: lastEntry.contentRect.width,
        height: lastEntry.contentRect.height,
      };
      if (prevViewportSize.width !== this.viewportSize.width || prevViewportSize.height !== this.viewportSize.height) {
        this.refreshThumbs();
        this.scrollBy(0, 0, true);
      }
    }
  };

  onWheel = (ev: WheelEvent) => {
    const canScrollH =
      (ev.deltaX > 0 && this.viewportSize.width + this.viewportOffset.x < this.scrollSize.width) ||
      (ev.deltaX < 0 && this.viewportOffset.x > 0);
    const canScrollV =
      (ev.deltaY > 0 && this.viewportSize.height + this.viewportOffset.y < this.scrollSize.height) ||
      (ev.deltaY < 0 && this.viewportOffset.y > 0);
    if (!canScrollH && !canScrollV) {
      return;
    }
    ev.preventDefault();
    this.scrollBy(ev.deltaX, ev.deltaY);
    this.refreshThumbs();
  };

  onPointerDown = (ev: PointerEvent) => {
    if (ev.button === 1) {
      const canScrollHorizontally = this.scrollSize.width > this.viewportSize.width;
      const canScrollVertically = this.scrollSize.height > this.viewportSize.height;
      if (!canScrollHorizontally && !canScrollVertically) {
        return;
      }
      ev.preventDefault();
      const startX = ev.clientX;
      const startY = ev.clientY;
      let deltaX = 0;
      let deltaY = 0;
      let icon = iconBoth;
      if (!canScrollHorizontally) {
        icon = iconVertical;
      } else if (!canScrollVertically) {
        icon = iconHorizontal;
      }
      const dataUrl = `url("${icon}")`;
      const fullScreenDiv = document.createElement("div");
      fullScreenDiv.style.transform = "translateZ(0px)";
      fullScreenDiv.style.position = "fixed";
      fullScreenDiv.style.inset = "0";
      fullScreenDiv.style.zIndex = "2147483647";
      fullScreenDiv.style.backgroundRepeat = "no-repeat";
      fullScreenDiv.style.backgroundImage = dataUrl;
      fullScreenDiv.style.backgroundSize = "26px 26px";
      fullScreenDiv.style.backgroundPosition = `${ev.clientX - 13}px ${ev.clientY - 13}px`;
      const stopAnimation = startRafAnimation((timeDelta) => {
        timeDelta = (timeDelta * 60) / 1000;
        this.scrollBy(deltaX * timeDelta, deltaY * timeDelta);
        this.refreshThumbs();
      });
      fullScreenDiv.style.cursor = "none";
      fullScreenDiv.onpointermove = (e) => {
        deltaX = (e.clientX - startX) / 10;
        deltaY = (e.clientY - startY) / 10;
        const rad = Math.atan2(-deltaY, deltaX);
        if (hypoth(deltaX, deltaY) > 1) {
          fullScreenDiv.style.cursor = getCursorByAngle(rad);
        } else {
          fullScreenDiv.style.cursor = "none";
        }
      };
      const body = document.body ? document.body : document.documentElement;
      body.appendChild(fullScreenDiv);
      const removeFullScreenDiv = () => {
        try {
          body.removeChild(fullScreenDiv);
        } catch {}
        stopAnimation();
      };
      setTimeout(() =>
        document.addEventListener("pointerdown", removeFullScreenDiv, {
          once: true,
        }),
      );
      window.addEventListener("blur", removeFullScreenDiv, { once: true });
    }
  };

  onTouchStart = (ev: TouchEvent) => {
    let prevTouch = ev.touches[0];
    const vpo = { ...this.viewportOffset };
    ev.preventDefault();
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this.scrollBy(prevTouch.screenX - e.touches[0].screenX, prevTouch.screenY - e.touches[0].screenY);
      prevTouch = e.touches[0];
    };
    const onTouchEnd = (e: TouchEvent) => {
      this.container.removeEventListener("touchmove", onTouchMove);
      console.error("!!!");
    };
    const onTouchCancel = (e: TouchEvent) => {
      this.container.removeEventListener("touchmove", onTouchMove);
      console.error("!!!?");
    };
    this.container.addEventListener("touchmove", onTouchMove);
    this.container.addEventListener("touchend", onTouchEnd, { once: true });
    this.container.addEventListener("touchcancel", onTouchCancel, { once: true });
  };

  scrollTo = (x: number, y: number, forceFireEvent = false) => {
    let newX = x;
    newX = Math.min(newX, this.scrollSize.width - this.viewportSize.width);
    newX = Math.max(newX, 0);

    let newY = y;
    newY = Math.min(newY, this.scrollSize.height - this.viewportSize.height);
    newY = Math.max(newY, 0);

    if (forceFireEvent || this.viewportOffset.x !== newX || this.viewportOffset.y !== newY) {
      this.viewportOffset.x = newX;
      this.viewportOffset.y = newY;

      this.fireViewportChangeEvent();
    }
  };

  scrollBy = (dx: number, dy: number, forceFireEvent = false) => {
    this.scrollTo(this.viewportOffset.x + dx, this.viewportOffset.y + dy, forceFireEvent);
  };

  fireViewportChangeEvent = () => {
    this.emitter.emit("viewportchange", {
      ...this.viewportOffset,
      ...this.viewportSize,
    } satisfies ViewportChangeEvent);
  };
}
