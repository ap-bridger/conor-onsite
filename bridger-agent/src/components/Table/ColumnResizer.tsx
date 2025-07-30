type ColumnResizerProps = {
  onMouseDown: (e: React.MouseEvent) => void;
};

export function ColumnResizer({ onMouseDown }: ColumnResizerProps) {
  return (
    <div
      className="flex cursor-grab"
      style={{ width: "8px" }}
      onMouseDown={onMouseDown}
    />
  );
}
