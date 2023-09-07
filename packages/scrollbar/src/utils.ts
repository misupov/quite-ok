export function getCursorByAngle(rad: number) {
  let direction;
  if (rad <= Math.PI * (-7 / 8)) {
    direction = "w";
  } else if (rad <= Math.PI * (-5 / 8)) {
    direction = "sw";
  } else if (rad <= Math.PI * (-3 / 8)) {
    direction = "s";
  } else if (rad <= Math.PI * (-1 / 8)) {
    direction = "se";
  } else if (rad <= Math.PI * (1 / 8)) {
    direction = "e";
  } else if (rad <= Math.PI * (3 / 8)) {
    direction = "ne";
  } else if (rad <= Math.PI * (5 / 8)) {
    direction = "n";
  } else if (rad <= Math.PI * (7 / 8)) {
    direction = "nw";
  } else {
    direction = "w";
  }
  return `${direction}-resize`;
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
