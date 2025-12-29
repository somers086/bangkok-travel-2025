
export enum Tab {
  ITINERARY = 'itinerary',
  FINANCE = 'finance',
  SHOPPING = 'shopping'
}

export interface Spot {
  id: string;
  name: string;
  description: string;
  time?: string;
  location?: string;
  mapUrl?: string;
}

export interface Region {
  id: string;
  name: string;
  spots: Spot[];
  isOpen: boolean;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  note: string;
  date: string;
}

export interface ShoppingItem {
  id: string;
  text: string;
  completed: boolean;
}
