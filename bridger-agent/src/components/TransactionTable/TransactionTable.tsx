"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/Table/DataTable.component";
import { Transaction } from "./types";
import { useQuery } from "@apollo/client";
import { TRANSACTIONS } from "./TransactionTable.api";
import { FilterableDropdown } from "../FilterableDropdown/FilterableDropdown";
import { CATEGORIES, VENDORS } from "./TempData";

const numberFormat = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export const formatCentsToDollars = (amountCents: number): string => {
  return numberFormat.format(amountCents / 100);
};

const columnHelper = createColumnHelper<Transaction>();
const columns = [
  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => {
      const dt = new Date(Number(info.getValue()));
      return dt.toLocaleDateString();
    },
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => info.getValue(),
  }),
  // TODO: Vendor and Category columns will be dropdowns in the future
  // This functionality is not implemented yet
  columnHelper.accessor("vendor", {
    header: "Vendor",
    cell: ({ row, getValue }) => {
      const value = getValue();
      return (
        <div onClick={(e) => e.stopPropagation()}>
          <FilterableDropdown
            label=""
            placeholderText="Select vendor"
            selectedText={value}
            options={VENDORS}
            onSelect={(newValue) => {
              alert("Changing! " + newValue);
            }}
          />
        </div>
      );
    },
  }),
  columnHelper.accessor("category", {
    header: "Category",
    cell: ({ row, getValue }) => {
      const value = getValue();
      return (
        <div onClick={(e) => e.stopPropagation()}>
          <FilterableDropdown
            label=""
            placeholderText="Select category"
            selectedText={value}
            options={CATEGORIES}
            onSelect={(newValue) => {
              alert("Changing! " + newValue);
            }}
          />
        </div>
      );
    },
  }),
  columnHelper.accessor("amountCents", {
    header: "Amount",
    cell: (info) => {
      const value = info.getValue();
      return formatCentsToDollars(value);
    },
  }),
  columnHelper.accessor("memo", {
    header: "Memo",
    cell: (info) => info.getValue(),
  }),
];

export function TransactionTable() {
  const { data } = useQuery(TRANSACTIONS, {
    variables: {
      status: "APPROVED",
    },
  });
  const transactions = data?.transactions || [];
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      <DataTable data={transactions} columns={columns} />
    </div>
  );
}
