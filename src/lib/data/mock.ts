import type { PantrySummary, PantryItem } from '../types.js';

export const pantrySummary: PantrySummary = {
  totalItems: 24,
  expiringSoon: 3,
  missingEssentials: 2
};

export const mockPantryItems: PantryItem[] = [
  {
    id: '1',
    name: 'Latte',
    quantity: 1,
    unit: 'litro',
    expirationDate: new Date('2025-06-05'),
    isEssential: true
  },
  {
    id: '2',
    name: 'Pane',
    quantity: 2,
    unit: 'pezzi',
    expirationDate: new Date('2025-06-04'),
    isEssential: true
  },
  {
    id: '3',
    name: 'Pomodori',
    quantity: 500,
    unit: 'g',
    expirationDate: new Date('2025-06-08'),
    isEssential: false
  }
];


