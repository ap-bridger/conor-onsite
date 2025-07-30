import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  InitialTableState,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  useReactTable,
  type Row,
} from "@tanstack/react-table";
import { DataTableHeaderCell } from "./DataTableHeaderCell.component";
import { DataTableBody } from "./DataTableBody.component";
import { useEffect, useState } from "react";

export type RowSubComponent<TData> = (props: {
  row: Row<TData>;
}) => React.ReactElement;

export type TableSortingProps = {
  sortingState: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
};

export type DataTableProps<TData extends object> = {
  data: TData[];
  // We explicitly want to be able to take in columns of any value type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  sortingProps?: TableSortingProps;
  isLoading?: boolean;
  rowSubComponent?: RowSubComponent<TData>;
  onRowSelectionChange?: (rowSelectionState: RowSelectionState) => void;
  onRowExpandedChange?: (row_id: string, isExpanded: boolean) => void;
  width?: string;
  initialState?: InitialTableState;
  getRowId?: (originalRow: TData, index: number) => string;
  onRowClick?: (row: TData) => void;
};

export function DataTable<TData extends object>({
  data,
  columns,
  sortingProps,
  rowSubComponent,
  onRowSelectionChange,
  onRowExpandedChange,
  width,
  initialState,
  getRowId,
  onRowClick,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const table = useReactTable({
    columnResizeMode: "onChange",
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: !!sortingProps,
    onSortingChange: sortingProps?.onSortingChange,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: (updaterOrValue) => {
      let newSelection = undefined;
      if (typeof updaterOrValue === "function") {
        // If it's a function updater, call it with current value to get new value
        newSelection = updaterOrValue(rowSelection);
      } else {
        // If it's a direct value
        newSelection = updaterOrValue;
      }
      setRowSelection(newSelection);

      if (onRowSelectionChange) {
        onRowSelectionChange(newSelection);
      }
    },
    getRowId: getRowId,
    initialState,
    state: {
      rowSelection,
      sorting: sortingProps?.sortingState,
    },
  });
  // We need to explicitly add row selection since we're managing it outside the table
  useEffect(() => {
    if (initialState?.rowSelection) {
      setRowSelection(initialState.rowSelection);

      if (onRowSelectionChange) {
        onRowSelectionChange(initialState.rowSelection);
      }
    }
  }, [initialState?.rowSelection, onRowSelectionChange, setRowSelection]);
  useEffect(() => {
    table.setExpanded({});
    table.setRowSelection({});
  }, [data.length, columns, table]);
  return (
    <table className="table-fixed" style={{ width: width || "1250px" }}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <DataTableHeaderCell
                  header={header}
                  table={table}
                  key={header.id + headerGroup.id}
                />
              );
            })}
          </tr>
        ))}
      </thead>
      <DataTableBody
        table={table}
        rowSubComponent={rowSubComponent}
        onRowClick={onRowClick}
        onRowExpandedChange={onRowExpandedChange}
      />
    </table>
  );
}
