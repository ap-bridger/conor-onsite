"use client";

import { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/Table/DataTable.component';
import { FilterableDropdown } from '@/components/FilterableDropdown/FilterableDropdown';
import { Transaction } from './types';
import { CATEGORIES, VENDORS, SAMPLE_TRANSACTIONS } from './TempData';

const columnHelper = createColumnHelper<Transaction>();

export function TransactionTable() {
  const [data, setData] = useState<Transaction[]>(SAMPLE_TRANSACTIONS);

  // Update function for when dropdown values change
  const updateTransaction = (id: string, field: keyof Transaction, value: any) => {
    setData(data.map(transaction => 
      transaction.id === id 
        ? { ...transaction, [field]: value }
        : transaction
    ));
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('date', {
        header: 'Date',
        cell: info => info.getValue().toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('vendor', {
        header: 'Vendor',
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
                  updateTransaction(row.original.id, 'vendor', newValue);
                }}
              />
            </div>
          );
        },
      }),
      columnHelper.accessor('category', {
        header: 'Category',
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
                  updateTransaction(row.original.id, 'category', newValue);
                }}
              />
            </div>
          );
        },
      }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: info => {
          const value = info.getValue();
          const formatted = `$${Math.abs(value).toFixed(2)}`;
          return value < 0 ? `-${formatted}` : formatted;
        },
      }),
      columnHelper.accessor('comment', {
        header: 'Comment',
        cell: info => info.getValue(),
      }),
    ],
    []
  );

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      <DataTable
        data={data}
        columns={columns}
      />
    </div>
  );
}