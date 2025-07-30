"use client";

import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/Table/DataTable.component";
import { Transaction } from "./types";
import { useQuery, useMutation } from "@apollo/client";
import { 
  TRANSACTIONS, 
  GET_UNIQUE_VENDORS, 
  GET_UNIQUE_CATEGORIES,
  UPDATE_TRANSACTION_VENDOR,
  UPDATE_TRANSACTION_CATEGORY,
  UPDATE_TRANSACTION_MEMO
} from "./TransactionTable.api";
import { FilterableDropdown, FilterableDisplayElement } from "../FilterableDropdown/FilterableDropdown";
import { RequestInfoModal } from "./RequestInfoModal";
import { Button, Textarea } from "@chakra-ui/react";
import { formatCentsToDollars } from "@/lib/formatters";

const columnHelper = createColumnHelper<Transaction>();

export function TransactionTable() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data, loading } = useQuery(TRANSACTIONS, {
    variables: {
      status: "APPROVED",
    },
  });
  const transactions = data?.transactions || [];

  // Fetch unique vendors and categories from database
  const { data: vendorData, loading: vendorsLoading } = useQuery(GET_UNIQUE_VENDORS);
  const { data: categoryData, loading: categoriesLoading } = useQuery(GET_UNIQUE_CATEGORIES);

  // Mutations for updating vendor and category
  const [updateVendor] = useMutation(UPDATE_TRANSACTION_VENDOR, {
    optimisticResponse: ({ id, vendor }) => ({
      updateTransactionVendor: {
        success: true,
        message: 'Vendor updated successfully',
        transaction: {
          __typename: 'Transaction',
          id,
          vendor
        }
      }
    })
  });

  const [updateCategory] = useMutation(UPDATE_TRANSACTION_CATEGORY, {
    optimisticResponse: ({ id, category }) => ({
      updateTransactionCategory: {
        success: true,
        message: 'Category updated successfully',
        transaction: {
          __typename: 'Transaction',
          id,
          category
        }
      }
    })
  });

  const [updateMemo] = useMutation(UPDATE_TRANSACTION_MEMO, {
    optimisticResponse: ({ id, memo }) => ({
      updateTransactionMemo: {
        success: true,
        message: 'Memo updated successfully',
        transaction: {
          __typename: 'Transaction',
          id,
          memo
        }
      }
    })
  });

  // Convert to FilterableDisplayElement format
  const vendors = useMemo(() => 
    vendorData?.getUniqueVendors?.map((vendor: string) => ({
      key: vendor.toLowerCase().replace(/\s+/g, '-'),
      displayName: vendor,
      label: '',
      value: vendor
    })) || [], [vendorData]);

  const categories = useMemo(() =>
    categoryData?.getUniqueCategories?.map((category: string) => ({
      key: category.toLowerCase().replace(/\s+/g, '-'),
      displayName: category,
      label: '',
      value: category
    })) || [], [categoryData]);

  const columns = useMemo(() => [
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
                    vendor: newValue
                  }
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
                    category: newValue
                  }
                });
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
      cell: ({ row, getValue }) => {
        const currentValue = getValue() || '';
        
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Textarea
              defaultValue={currentValue}
              onBlur={(e) => {
                if (e.target.value !== currentValue) {
                  updateMemo({
                    variables: {
                      id: row.original.id,
                      memo: e.target.value
                    }
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
              _hover={{ borderColor: 'brand.lightGrey' }}
              _focus={{ borderColor: 'brand.blue', backgroundColor: 'brand.white' }}
            />
          </div>
        );
      }
    }),
  ], [vendors, categories, updateVendor, updateCategory, updateMemo]);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      <RequestInfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <Button onClick={() => setModalOpen(true)}>Send Info Request</Button>
      <DataTable data={transactions} columns={columns} isLoading={loading} />
    </div>
  );
}