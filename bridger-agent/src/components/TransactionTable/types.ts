export interface Transaction {
  id: string;
  date: Date;
  description: string;
  vendor: string;
  category: string;
  amount: number; // Negative for expenses, positive for income
  comment: string;
}