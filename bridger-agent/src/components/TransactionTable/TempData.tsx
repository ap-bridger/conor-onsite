import { FilterableDisplayElement } from '../FilterableDropdown/FilterableDropdown';
import { Transaction } from './types';

// Temporary data for categories and vendors

export const CATEGORIES: FilterableDisplayElement<string>[] = [
  { key: 'office', displayName: 'Office', label: '', value: 'Office' },
  { key: 'software', displayName: 'Software', label: '', value: 'Software' },
  { key: 'meals', displayName: 'Meals', label: '', value: 'Meals' },
  { key: 'travel', displayName: 'Travel', label: '', value: 'Travel' },
  { key: 'income', displayName: 'Income', label: '', value: 'Income' }
];

export const VENDORS: FilterableDisplayElement<string>[] = [
  { key: 'staples', displayName: 'Staples', label: '', value: 'Staples' },
  { key: 'adobe', displayName: 'Adobe', label: '', value: 'Adobe' },
  { key: 'amazon', displayName: 'Amazon', label: '', value: 'Amazon' },
  { key: 'local-cafe', displayName: 'The Local Cafe', label: '', value: 'The Local Cafe' },
  { key: 'abc-corp', displayName: 'ABC Corp', label: '', value: 'ABC Corp' }
];

// Sample transaction data for testing
export const SAMPLE_TRANSACTIONS: Transaction[] = [
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