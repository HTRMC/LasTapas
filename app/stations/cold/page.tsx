// File: app/stations/cold/page.tsx

'use client';

import { useState, useEffect } from 'react';
import styles from '../StationPage.module.css';
import { Order, OrderItem } from '../types';

const COLD_ITEMS = [2, 9]; // IDs for Gazpacho and Churros con Chocolate

export default function ColdStation() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/submissions');
      if (response.ok) {
        const data = await response.json();
        const filteredOrders = data.orders.filter((order: Order) =>
          order.items.some((item: OrderItem) => COLD_ITEMS.includes(item.dishId))
        );
        setOrders(filteredOrders);
      }
    };

    fetchOrders();

    const eventSource = new EventSource('/api/sse');
    eventSource.onmessage = (event) => {
      if (event.data === 'newOrder') {
        fetchOrders();
      }
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cold Station / Desserts</h1>
      <div className={styles.orderList}>
        {orders.map((order) => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <span className={styles.orderNumber}>Table {order.tableNumber}</span>
              <span className={styles.orderTime}>
                {new Date(order.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <ul className={styles.itemList}>
              {order.items
                .filter((item) => COLD_ITEMS.includes(item.dishId))
                .map((item) => (
                  <li key={item.id} className={styles.item}>
                    <span className={styles.itemName}>{item.dishName}</span>
                    <span className={styles.quantity}>×{item.quantity}</span>
                  </li>
                ))}
            </ul>
            <button className={styles.completeButton}>Complete Order</button>
          </div>
        ))}
      </div>
    </div>
  );
}