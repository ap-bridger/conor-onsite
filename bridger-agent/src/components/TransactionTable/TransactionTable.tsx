"use client";

import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/Table/DataTable.component";
import { Transaction } from "./types";
import { useQuery, useMutation } from "@apollo/client";
import {
  TRANSACTIONS,
  AUTOCATEGORIZED_TRANSACTIONS,
  SYNCED_TRANSACTIONS,
  NEEDS_ACTION_TRANSACTIONS,
  UNCATEGORIZED_TRANSACTIONS,
  GET_UNIQUE_VENDORS,
  GET_UNIQUE_CATEGORIES,
  UPDATE_TRANSACTION_VENDOR,
  UPDATE_TRANSACTION_CATEGORY,
  UPDATE_TRANSACTION_MEMO,
  RUN_PREDICTIONS,
} from "./TransactionTable.api";
import {
  FilterableDropdown,
  FilterableDisplayElement,
} from "../FilterableDropdown/FilterableDropdown";
import { RequestInfoModal } from "./RequestInfoModal";
import { Button, Textarea } from "@chakra-ui/react";
import { formatCentsToDollars } from "@/lib/formatters";

type TableView = "autocategorized" | "synced" | "needsAction" | "uncategorized";

const columnHelper = createColumnHelper<Transaction>();

export function TransactionTable() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<TableView>("autocategorized");

  // Query for AutoCategorized transactions
  const { data: autocategorizedData, loading: autocategorizedLoading } =
    useQuery(AUTOCATEGORIZED_TRANSACTIONS, {
      skip: currentView !== "autocategorized",
    });

  // Query for Synced transactions (APPROVED and EXCLUDED)
  const { data: syncedData, loading: syncedLoading } = useQuery(
    SYNCED_TRANSACTIONS,
    {
      skip: currentView !== "synced",
    }
  );

  // Query for Needs Client Action transactions
  const { data: needsActionData, loading: needsActionLoading } = useQuery(
    NEEDS_ACTION_TRANSACTIONS,
    {
      skip: currentView !== "needsAction",
    }
  );

  // Query for UnCategorized transactions
  const { data: uncategorizedData, loading: uncategorizedLoading } = useQuery(
    UNCATEGORIZED_TRANSACTIONS,
    {
      skip: currentView !== "uncategorized",
    }
  );

  // Fetch unique vendors and categories from database
  const { data: vendorData, loading: vendorsLoading } =
    useQuery(GET_UNIQUE_VENDORS);
  const { data: categoryData, loading: categoriesLoading } = useQuery(
    GET_UNIQUE_CATEGORIES
  );

  // Mutations for updating vendor and category
  const [updateVendor] = useMutation(UPDATE_TRANSACTION_VENDOR, {
    optimisticResponse: ({ id, vendor }) => ({
      updateTransactionVendor: {
        success: true,
        message: "Vendor updated successfully",
        transaction: {
          __typename: "Transaction",
          id,
          vendor,
        },
      },
    }),
  });

  const [updateCategory] = useMutation(UPDATE_TRANSACTION_CATEGORY, {
    optimisticResponse: ({ id, category }) => ({
      updateTransactionCategory: {
        success: true,
        message: "Category updated successfully",
        transaction: {
          __typename: "Transaction",
          id,
          category,
        },
      },
    }),
  });

  const [updateMemo] = useMutation(UPDATE_TRANSACTION_MEMO, {
    optimisticResponse: ({ id, memo }) => ({
      updateTransactionMemo: {
        success: true,
        message: "Memo updated successfully",
        transaction: {
          __typename: "Transaction",
          id,
          memo,
        },
      },
    }),
  });

  const [runPredictions] = useMutation(RUN_PREDICTIONS, {
    refetchQueries: [TRANSACTIONS],
  });

  // Convert to FilterableDisplayElement format
  const vendors = useMemo(
    () =>
      vendorData?.getUniqueVendors?.map((vendor: string) => ({
        key: vendor.toLowerCase().replace(/\s+/g, "-"),
        displayName: vendor,
        label: "",
        value: vendor,
      })) || [],
    [vendorData]
  );

  const categories = useMemo(
    () =>
      categoryData?.getUniqueCategories?.map((category: string) => ({
        key: category.toLowerCase().replace(/\s+/g, "-"),
        displayName: category,
        label: "",
        value: category,
      })) || [],
    [categoryData]
  );

  // Get transactions based on current view
  const getTransactions = () => {
    switch (currentView) {
      case "autocategorized":
        return autocategorizedData?.transactions || [];
      case "synced":
        return syncedData?.transactions || [];
      case "needsAction":
        return needsActionData?.transactions || [];
      case "uncategorized":
        return uncategorizedData?.transactions || [];
      default:
        return [];
    }
  };

  const getLoadingState = () => {
    switch (currentView) {
      case "autocategorized":
        return autocategorizedLoading;
      case "synced":
        return syncedLoading;
      case "needsAction":
        return needsActionLoading;
      case "uncategorized":
        return uncategorizedLoading;
      default:
        return false;
    }
  };

  const transactions = getTransactions();
  const loading = getLoadingState();

  const getViewTitle = () => {
    switch (currentView) {
      case "autocategorized":
        return "AutoCategorized";
      case "synced":
        return "Synced With Quickbooks";
      case "needsAction":
        return "Needs Client Action";
      case "uncategorized":
        return "UnCategorized";
      default:
        return "Transactions";
    }
  };

  const columns = useMemo(
    () => [
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
                options={vendors}
                onSelect={(newValue) => {
                  updateVendor({
                    variables: {
                      id: row.original.id,
                      vendor: newValue,
                    },
                  });
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
                options={categories}
                onSelect={(newValue) => {
                  updateCategory({
                    variables: {
                      id: row.original.id,
                      category: newValue,
                    },
                  });
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
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : status === "NEEDS_TO_BE_SENT_TO_CLIENT"
                  ? "bg-yellow-100 text-yellow-800"
                  : status === "EXCLUDED"
                  ? "bg-red-100 text-red-800"
                  : status === "AUTOCATEGORIZED"
                  ? "bg-blue-100 text-blue-800"
                  : status === "SENT_TO_CLIENT"
                  ? "bg-purple-100 text-purple-800"
                  : status === "UNCATEGORIZED"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
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
        cell: ({ row, getValue }) => {
          const currentValue = getValue() || "";

          return (
            <div onClick={(e) => e.stopPropagation()}>
              <Textarea
                defaultValue={currentValue}
                onBlur={(e) => {
                  if (e.target.value !== currentValue) {
                    updateMemo({
                      variables: {
                        id: row.original.id,
                        memo: e.target.value,
                      },
                    });
                  }
                }}
                placeholder="Add memo..."
                size="sm"
                resize="none"
                rows={1}
                minHeight="32px"
                backgroundColor="transparent"
                border="1px solid transparent"
                _hover={{ borderColor: "brand.lightGrey" }}
                _focus={{
                  borderColor: "brand.blue",
                  backgroundColor: "brand.white",
                }}
              />
            </div>
          );
        },
      }),
    ],
    [vendors, categories, updateVendor, updateCategory, updateMemo]
  );

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
          <button
            onClick={() => setCurrentView("uncategorized")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === "uncategorized"
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            UnCategorized
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
      {currentView === "uncategorized" && (
        <Button onClick={() => runPredictions()}>Run Predictions</Button>
      )}
      <DataTable data={transactions} columns={columns} isLoading={loading} />
    </div>
  );
}
