import { ScrollPanel as VanillaScrollPanel } from "@quite-ok/scrollpanel";
import { ReactElement, useLayoutEffect, useRef } from "react";

export type ScrollPanelProps = {
  scrollWidth: number;
  scrollHeight: number;
  onViewportChange: (
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
  children: ReactElement;
};

export function ScrollPanel({
  scrollWidth,
  scrollHeight,
  onViewportChange,
  children,
}: ScrollPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollpanelRef = useRef<VanillaScrollPanel>();
  useLayoutEffect(() => {
    if (containerRef.current && targetRef.current) {
      scrollpanelRef.current = new VanillaScrollPanel(
        containerRef.current,
        targetRef.current
      );
      scrollpanelRef.current.on("viewportchange", (e) => {
        onViewportChange(e.x, e.y, e.width, e.height);
      });
      return () => {
        scrollpanelRef.current?.destroy();
        scrollpanelRef.current = undefined;
      };
    }
  }, []);

  useLayoutEffect(() => {
    scrollpanelRef.current?.setScrollArea(scrollWidth, scrollHeight);
  }, [scrollWidth, scrollHeight]);

  return (
    <div ref={containerRef}>
      <div ref={targetRef} style={{ position: "absolute", inset: 0 }}>
        {children}
      </div>
    </div>
  );
}
