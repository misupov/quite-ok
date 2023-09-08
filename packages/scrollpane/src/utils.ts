import panWest from "./cursors/pan_west.cur";
import panSouthWest from "./cursors/pan_south_west.cur";
import panSouth from "./cursors/pan_south.cur";
import panSouthEast from "./cursors/pan_south_east.cur";
import panEast from "./cursors/pan_east.cur";
import panNorthEast from "./cursors/pan_north_east.cur";
import panNorth from "./cursors/pan_north.cur";
import panNorthWest from "./cursors/pan_north_west.cur";

export function getCursorByAngle(rad: number) {
  if (rad <= Math.PI * (-7 / 8)) {
    return `url(${panWest}), auto`;
  } else if (rad <= Math.PI * (-5 / 8)) {
    return `url(${panSouthWest}), auto`;
  } else if (rad <= Math.PI * (-3 / 8)) {
    return `url(${panSouth}), auto`;
  } else if (rad <= Math.PI * (-1 / 8)) {
    return `url(${panSouthEast}), auto`;
  } else if (rad <= Math.PI * (1 / 8)) {
    return `url(${panEast}), auto`;
  } else if (rad <= Math.PI * (3 / 8)) {
    return `url(${panNorthEast}), auto`;
  } else if (rad <= Math.PI * (5 / 8)) {
    return `url(${panNorth}), auto`;
  } else if (rad <= Math.PI * (7 / 8)) {
    return `url(${panNorthWest}), auto`;
  } else {
    return `url(${panWest}), auto`;
  }
}

export function hypoth(x: number, y: number) {
  return Math.sqrt(x ** 2 + y ** 2);
}

export function startRafAnimation(callback: () => void) {
  let cancelled = false;
  let rAF: number;
  const rafCallback = () => {
    callback();
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
