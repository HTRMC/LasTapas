// File: app/stations/types.ts

export interface OrderItem {
    id: number;
    dishName: string;
    quantity: number;
    dishId: number;
  }
  
  export interface Order {
    id: number;
    tableNumber: number;
    createdAt: string;
    items: OrderItem[];
  }
  
  export type StationType = 'bar' | 'grill' | 'pan' | 'cold' | 'plating';
  