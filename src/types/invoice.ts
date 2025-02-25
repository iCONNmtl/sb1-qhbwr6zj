export interface Invoice {
    id: string;
    userId: string;
    number: string;
    amount: number;
    type: 'credits' | 'training';
    description: string;
    createdAt: string;
    paidAt: string;
    url?: string;
  }