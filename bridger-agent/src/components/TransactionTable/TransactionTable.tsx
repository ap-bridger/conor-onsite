"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/Table/DataTable.component";
import { Transaction } from "./types";
import { useQuery } from "@apollo/client";
import { TRANSACTIONS } from "./TransactionTable.api";
import { FilterableDropdown } from "../FilterableDropdown/FilterableDropdown";
import { CATEGORIES, VENDORS } from "./TempData";
import { useState } from "react";
import { RequestInfoModal } from "./RequestInfoModal";
import { Button } from "@chakra-ui/react";
import { formatCentsToDollars } from "@/lib/formatters";

type TableView = "autocategorized" | "synced" | "needsAction";

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
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'APPROVED' ? 'bg-green-100 text-green-800' :
          status === 'NEEDS_TO_BE_SENT_TO_CLIENT' ? 'bg-yellow-100 text-yellow-800' :
          status === 'EXCLUDED' ? 'bg-red-100 text-red-800' :
          status === 'AUTOCATEGORIZED' ? 'bg-blue-100 text-blue-800' :
          status === 'SENT_TO_CLIENT' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
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
  const [modalOpen, setModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<TableView>("autocategorized");

  // Query for AutoCategorized transactions
  const { data: autocategorizedData } = useQuery(TRANSACTIONS, {
    variables: { status: "AUTOCATEGORIZED" },
    skip: currentView !== "autocategorized",
  });

  // Query for Synced transactions (APPROVED and EXCLUDED)
  const { data: approvedData } = useQuery(TRANSACTIONS, {
    variables: { status: "APPROVED" },
    skip: currentView !== "synced",
  });

  const { data: excludedData } = useQuery(TRANSACTIONS, {
    variables: { status: "EXCLUDED" },
    skip: currentView !== "synced",
  });

  // Query for Needs Client Action transactions
  const { data: needsActionData } = useQuery(TRANSACTIONS, {
    variables: { status: "NEEDS_TO_BE_SENT_TO_CLIENT" },
    skip: currentView !== "needsAction",
  });

  const { data: sentToClientData } = useQuery(TRANSACTIONS, {
    variables: { status: "SENT_TO_CLIENT" },
    skip: currentView !== "needsAction",
  });

  // Get transactions based on current view
  const getTransactions = () => {
    switch (currentView) {
      case "autocategorized":
        return autocategorizedData?.transactions || [];
      case "synced":
        const approved = approvedData?.transactions || [];
        const excluded = excludedData?.transactions || [];
        return [...approved, ...excluded];
      case "needsAction":
        const needsAction = needsActionData?.transactions || [];
        const sentToClient = sentToClientData?.transactions || [];
        return [...needsAction, ...sentToClient];
      default:
        return [];
    }
  };

  const transactions = getTransactions();

  const getViewTitle = () => {
    switch (currentView) {
      case "autocategorized":
        return "AutoCategorized";
      case "synced":
        return "Synced With Quickbooks";
      case "needsAction":
        return "Needs Client Action";
      default:
        return "Transactions";
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{getViewTitle()}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentView("autocategorized")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === "autocategorized"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            AutoCategorized
          </button>
          <button
            onClick={() => setCurrentView("synced")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === "synced"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Synced With Quickbooks
          </button>
          <button
            onClick={() => setCurrentView("needsAction")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === "needsAction"
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Needs Client Action
          </button>
        </div>
      </div>
      <RequestInfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      {currentView === "needsAction" && (
        <Button onClick={() => setModalOpen(true)}>Send Info Request</Button>
      )}
      <DataTable data={transactions} columns={columns} />
    </div>
  );
}
