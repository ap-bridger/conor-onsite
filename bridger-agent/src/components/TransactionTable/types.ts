export interface Transaction {
  id: string;
  date: Date;
  description: string;
  vendor: string;
  category: string;
  amountCents: number; // Negative for expenses, positive for income
  memo: string;
}
