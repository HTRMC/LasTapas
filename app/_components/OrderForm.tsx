// File: app/components/OrderForm.tsx

import { useState } from 'react';
import styles from '@/app/_components/OrderForm.module.css';
import React from 'react';
import { Allergy } from '@/app/_lib/allergies';

interface OrderItem {
  id: number;
  name: string;
  image: string;
  allergies: Allergy[];
  quantity: number;
  category: string;
  subcategory?: string;
}

interface OrderFormProps {
  order: OrderItem[];
  setOrder: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  tableNumber: number;
}

export default function OrderForm({ order, setOrder, tableNumber }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const removeFromOrder = (dishId: number) => {
    setOrder(currentOrder => {
      const existingItem = currentOrder.find(item => item.id === dishId);
      if (existingItem && existingItem.quantity > 1) {
        return currentOrder.map(item =>
          item.id === dishId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return currentOrder.filter(item => item.id !== dishId);
    });
  };

  const submitOrder = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');
    try {
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order, tableNumber }),
      });
      if (response.ok) {
        const { order: savedOrder } = await response.json();
        setSubmitMessage(`Order submitted successfully! Order ID: ${savedOrder.id}`);
        setOrder([]);
      } else {
        throw new Error('Order submission failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage('Order submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.orderForm}>
      <h2 className={styles.orderTitle}>Your Tapas Round - Table {tableNumber}</h2>
      {order.length === 0 ? (
        <p className={styles.emptyOrder}>Your round is empty. Add some tapas from the menu!</p>
      ) : (
        <>
          <ul className={styles.orderList}>
            {order.map(item => (
              <li key={item.id} className={styles.orderItem}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemQuantity}>x{item.quantity}</span>
                <button onClick={() => removeFromOrder(item.id)} className={styles.removeButton}>×</button>
              </li>
            ))}
          </ul>
          <button onClick={submitOrder} disabled={isSubmitting} className={styles.submitButton}>
            {isSubmitting ? 'Ordering...' : 'Order Round'}
          </button>
          {submitMessage && <p className={styles.submitMessage}>{submitMessage}</p>}
        </>
      )}
    </div>
  );
}