import panWest from "./cursors/pan_west.png";
import panSouthWest from "./cursors/pan_south_west.png";
import panSouth from "./cursors/pan_south.png";
import panSouthEast from "./cursors/pan_south_east.png";
import panEast from "./cursors/pan_east.png";
import panNorthEast from "./cursors/pan_north_east.png";
import panNorth from "./cursors/pan_north.png";
import panNorthWest from "./cursors/pan_north_west.png";

export function getCursorByAngle(angleRad: number) {
  const angle = angleRad / Math.PI;
  let result: string;
  if (angle <= -7 / 8) {
    result = panWest;
  } else if (angle <= -5 / 8) {
    result = panSouthWest;
  } else if (angle <= -3 / 8) {
    result = panSouth;
  } else if (angle <= -1 / 8) {
    result = panSouthEast;
  } else if (angle <= 1 / 8) {
    result = panEast;
  } else if (angle <= 3 / 8) {
    result = panNorthEast;
  } else if (angle <= 5 / 8) {
    result = panNorth;
  } else if (angle <= 7 / 8) {
    result = panNorthWest;
  } else {
    result = panWest;
  }
  return `url(${result}) 16 16, auto`;
}

export function hypoth(x: number, y: number) {
  return Math.sqrt(x ** 2 + y ** 2);
}

export function startRafAnimation(callback: (delta: number) => void) {
  let cancelled = false;
  let rAF: number;
  let now = performance.now();
  const rafCallback = (time: number) => {
    callback(time - now);
    now = time;
    if (!cancelled) {
      rAF = requestAnimationFrame(rafCallback);
    }
  };
  rAF = requestAnimationFrame(rafCallback);
  return () => {
    cancelAnimationFrame(rAF);
    cancelled = true;
  };
}
