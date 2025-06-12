interface Food {
  id: string;
  name: string;
  quantity: string;
  category?: string;
}

interface PantryItem extends Food {
  expirationDate: Date | null;
  isEssential: boolean;
}

interface ShopItem extends Food {
  importance: 'low' | 'medium' | 'high';
  added: Date;
  completed: boolean;
}

interface PantrySummary {
  totalItems: number;
  expiringSoon: number;
  missingEssentials: number;
}

interface NavButtonProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

interface SummaryCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'amber' | 'red' | 'green';
}

interface Info {
  type: string;
  title: string;
  message?: string;
}


type SerializedPantryItem = Omit<PantryItem, 'expirationDate' | 'addedDate'> & {
  expirationDate: string;
};

type SerializedShopItem = Omit<ShopItem, 'added'> & {
  added: string;
};

type SerializedItem = SerializedPantryItem | SerializedShopItem;

export type { PantryItem, PantrySummary, NavButtonProps, SummaryCardProps, ShopItem, SerializedItem, Info }
export type ExpiryStatus = 'fresh' | 'expiring' | 'expired';