"use client";

import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/Table/DataTable.component';
import { Transaction } from './types';

const columnHelper = createColumnHelper<Transaction>();

// Sample data for testing
const sampleData: Transaction[] = [
  {
    id: '1',
    date: new Date('2024-01-15'),
    description: 'Office Supplies',
    vendor: 'Staples',
    category: 'Office',
    amount: -125.50,
    comment: ''
  },
  {
    id: '2',
    date: new Date('2024-01-16'),
    description: 'Client Payment',
    vendor: 'ABC Corp',
    category: 'Income',
    amount: 5000.00,
    comment: ''
  },
  {
    id: '3',
    date: new Date('2024-01-17'),
    description: 'Software Subscription',
    vendor: 'Adobe',
    category: 'Software',
    amount: -59.99,
    comment: ''
  },
  {
    id: '4',
    date: new Date('2024-01-18'),
    description: 'Business Lunch',
    vendor: 'The Local Cafe',
    category: 'Meals',
    amount: -45.75,
    comment: ''
  },
  {
    id: '5',
    date: new Date('2024-01-19'),
    description: 'Consulting Fee',
    vendor: 'XYZ Partners',
    category: 'Income',
    amount: 2500.00,
    comment: ''
  }
];

export function TransactionTable() {
  // TODO: Vendor and Category columns will be dropdowns in the future
  // This functionality is not implemented yet
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
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: info => info.getValue(),
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
        data={sampleData}
        columns={columns}
      />
    </div>
  );
}