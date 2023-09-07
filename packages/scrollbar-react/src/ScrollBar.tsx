import { ScrollPane as VanillaScrollPane } from "@quite-ok/scrollbar";
import { ReactElement, useLayoutEffect, useRef } from "react";

export type ScrollBarProps = {
  scrollWidth: number;
  scrollHeight: number;
  children: ReactElement;
};

export function ScrollBar({
  scrollWidth,
  scrollHeight,
  children,
}: ScrollBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<VanillaScrollPane>();
  useLayoutEffect(() => {
    if (containerRef.current && targetRef.current) {
      scrollbarRef.current = new VanillaScrollPane(
        containerRef.current,
        targetRef.current
      );
      return () => {
        scrollbarRef.current?.destroy();
        scrollbarRef.current = undefined;
      };
    }
  }, []);

  useLayoutEffect(() => {
    scrollbarRef.current?.setScrollArea(scrollWidth, scrollHeight);
  }, [scrollWidth, scrollHeight]);

  return (
    <div ref={containerRef}>
      <div ref={targetRef} style={{ position: "absolute", inset: 0 }}>
        {children}
      </div>
    </div>
  );
}
