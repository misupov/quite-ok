import { ScrollPanel as VanillaScrollPanel } from "@quite-ok/scrollpanel";
import { ReactElement, useLayoutEffect, useRef } from "react";

export type ViewportChangeEvent = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ViewportChangeEventHandler = (event: ViewportChangeEvent) => void;

export type ScrollPanelProps = {
  scrollWidth: number;
  scrollHeight: number;
  onViewportChange: ViewportChangeEventHandler;
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
        onViewportChange(e);
      });
      return () => {
        scrollpanelRef.current?.destroy();
        scrollpanelRef.current = undefined;
      };
    }
  }, [onViewportChange]);

  useLayoutEffect(() => {
    scrollpanelRef.current?.setScrollArea(scrollWidth, scrollHeight);
  }, [scrollWidth, scrollHeight]);

  return (
    <div ref={containerRef}>
      <div
        ref={targetRef}
        style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      >
        {children}
      </div>
    </div>
  );
}
