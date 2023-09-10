export function div(style?: Partial<CSSStyleDeclaration>) {
  const result = document.createElement("div");
  style &&
    Object.entries(style).forEach(([key, value]) => {
      result.style[key as any] = value as any;
    });
  return result;
}

export function applyStyle(el: HTMLElement, style: Partial<CSSStyleDeclaration>) {
  Object.entries(style).forEach(([key, value]) => {
    el.style[key as any] = value as any;
  });
}
