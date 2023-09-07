export class ScrollBar {
  private readonly container: HTMLElement;
  private readonly track: HTMLDivElement;
  private readonly thumb: HTMLDivElement;
  private readonly dir: "h" | "v";

  constructor(container: HTMLElement, dir: "h" | "v") {
    this.dir = dir;
    const track = document.createElement("div");
    track.style.position = "absolute";
    track.style.background = "#8883";
    track.style.borderRadius = "10px";
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

    const thumb = document.createElement("div");
    thumb.style.position = "absolute";
    if (dir === "v") {
      thumb.style.top = "0";
      thumb.style.right = "0";
      thumb.style.width = "10px";
    } else {
      thumb.style.left = "0";
      thumb.style.bottom = "0";
      thumb.style.height = "10px";
    }
    thumb.style.background = "red";
    thumb.style.borderRadius = "10px";

    track.appendChild(thumb);
    container.appendChild(track);
    this.container = container;
    this.track = track;
    this.thumb = thumb;
  }

  destroy() {
    this.container.removeChild(this.track);
  }

  updateGeometry(offset: number, size: number) {
    if (this.dir === "v") {
      this.thumb.style.top = `${offset * 100}%`;
      this.thumb.style.height = `max(10px, ${size * 100}%)`;
    } else {
      this.thumb.style.left = `${offset * 100}%`;
      this.thumb.style.width = `max(10px, ${size * 100}%)`;
    }
  }
}
