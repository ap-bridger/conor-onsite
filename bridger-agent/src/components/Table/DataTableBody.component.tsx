import { Row, type Table as TableType } from "@tanstack/react-table";
import { type RowSubComponent } from "./DataTable.component";
import { DataTableCell } from "./DataTableCell.component";

type DataTableBodyProps<TData> = {
  table: TableType<TData>;
  error?: unknown;
  isLoading?: boolean;
  rowSubComponent?: RowSubComponent<TData>;
  onRowExpandedChange?: (row_id: string, isExpanded: boolean) => void;
  onRowClick?: (row: TData) => void;
};

export function DataTableBody<TData>({
  table,
  rowSubComponent,
  onRowExpandedChange,
  onRowClick,
}: DataTableBodyProps<TData>) {
  const rows = table.getRowModel().rows;
  return (
    <tbody>
      {rows.map((row) => (
        <DataTableRow
          key={row.id}
          row={row}
          table={table}
          rowSubComponent={rowSubComponent}
          onRowExpandedChange={onRowExpandedChange}
          onRowClick={onRowClick}
        />
      ))}
    </tbody>
  );
}

type DataTableRowProps<TData> = {
  row: Row<TData>;
  table: TableType<TData>;
  rowSubComponent?: RowSubComponent<TData>;
  onRowExpandedChange?: (row_id: string, isExpanded: boolean) => void;
  onRowClick?: (row: TData) => void;
};

function DataTableRow<TData>({
  row,
  table,
  rowSubComponent,
  onRowExpandedChange,
  onRowClick,
}: DataTableRowProps<TData>) {
  const toggleExpanded = () => {
    if (row.getIsExpanded()) {
      // Notify that the row is now closed
      onRowExpandedChange?.(row.id, false);
      table.setExpanded(() => {
        return {};
      });
    } else {
      // Notify that any currently expanded rows are now closed
      const expandedRows = table.getState().expanded;
      Object.entries(expandedRows).forEach(([expandedRowId, isExpanded]) => {
        if (isExpanded) {
          onRowExpandedChange?.(expandedRowId, false);
        }
      });

      // Notify that the row is now expanded
      onRowExpandedChange?.(row.id, true);

      table.setExpanded(() => {
        return {
          [row.id]: true,
        };
      });
    }
  };
  const handleClick = () => {
    if (onRowClick) {
      onRowClick(row.original);
    }
    toggleExpanded();
  };
  return (
    <>
      <tr className="hover:bg-gray-100 cursor-pointer" onClick={handleClick}>
        {row.getVisibleCells().map((cell) => (
          <DataTableCell cell={cell} key={cell.id} />
        ))}
      </tr>
      {row.getIsExpanded() && rowSubComponent && (
        <tr className="w-full">
          <td
            style={{ backgroundColor: "#F3F4F6" }}
            colSpan={row.getVisibleCells().length}
          >
            {rowSubComponent({ row })}
          </td>
        </tr>
      )}
    </>
  );
}
