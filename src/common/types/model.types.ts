export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  budgetId: string;
  emailVerified: boolean;
  Transactions?: Transaction[];
  Pendings?: PendingItem[];
  Budget?: Budget;
  Sessions?: Session[];
};

export type Session = {
  id: string;
  userId: string;
  secret: string;
  createdAt: Date;
  User?: User;
};

export type PendingItem = {
  id: string;
  userId: string;
  content: string;
  status: boolean;
  createdAt: Date;
  User?: User;
};

export type Budget = {
  id: string;
  name: string;
  amount: number;
  createdAt: Date;
  User?: User[];
};

export type Transaction = {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string | null;
  createdAt: Date;
  User?: User;
};
