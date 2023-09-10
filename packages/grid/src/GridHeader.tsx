import { ColumnsApi } from "./ColumnsApi";

type GridHeaderProps<T> = {
  columnsApi: ColumnsApi<T>;
  viewportX: number;
  viewportWidth: number;
};

export function GridHeader<T>({
  columnsApi,
  viewportX,
  viewportWidth,
}: GridHeaderProps<T>) {
  console.error(columnsApi.getVisibleColumns(viewportX, viewportWidth));
  return (
    <div
      style={{
        transform: `translateX(-${viewportX}px)`,
        // overflow: "hidden",
        position: "relative",
        height: 25,
      }}
    >
      {columnsApi.getVisibleColumns(viewportX, viewportWidth).map((s, idx) => (
        <div
          key={idx}
          style={{
            width: s.state.width,
            position: "absolute",
            left: s.offset,
          }}
        >
          {s.def.header ?? s.def.id}
        </div>
      ))}
    </div>
  );
}
