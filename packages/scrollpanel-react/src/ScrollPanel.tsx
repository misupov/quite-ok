import { ScrollPanel as VanillaScrollPanel } from "@quite-ok/scrollpanel";
import { ReactElement, useLayoutEffect, useRef } from "react";

export type ScrollPanelProps = {
  scrollWidth: number;
  scrollHeight: number;
  children: ReactElement;
};

export function ScrollPanel({
  scrollWidth,
  scrollHeight,
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
