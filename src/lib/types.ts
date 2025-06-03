export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expirationDate: Date;
  isEssential: boolean;
}

export interface PantrySummary {
  totalItems: number;
  expiringSoon: number;
  missingEssentials: number;
}

export interface NavButtonProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

export interface SummaryCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'amber' | 'red' | 'green';
}

export interface ShopItem {
  id: string;
  name: string;
  quantity: string;
  importance: 'low' | 'medium' | 'high';
  category?: string;
  added: Date;
  completed: boolean;
  }