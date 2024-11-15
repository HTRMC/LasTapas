// File: app/submissions/page.tsx

'use client';

import { useState, useEffect } from 'react';
import styles from './SubmissionsPage.module.css';

interface Submission {
  id: number;
  content: string;
  createdAt: string;
}

interface OrderItem {
  id: number;
  dishName: string;
  quantity: number;
}

interface Order {
  id: number;
  tableNumber: number;
  createdAt: string;
  items: OrderItem[];
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/submissions');
        if (!response.ok) {
          throw new Error('Failed to fetch submissions');
        }
        const data = await response.json();
        setSubmissions(data.submissions);
        setOrders(data.orders);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchData();

    const eventSource = new EventSource('/api/sse');
    eventSource.onmessage = (event) => {
      if (event.data === 'newSubmission' || event.data === 'newOrder') {
        fetchData();
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Submissions and Orders</h1>
      
      <section className={styles.section}>
        <h2>Recent Submissions</h2>
        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <ul className={styles.list}>
            {submissions.map((submission) => (
              <li key={submission.id} className={styles.item}>
                <p>{submission.content}</p>
                <small>Submitted at: {new Date(submission.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h2>Recent Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <ul className={styles.list}>
            {orders.map((order) => (
              <li key={order.id} className={styles.item}>
                <h3>Order #{order.id} - Table {order.tableNumber}</h3>
                <p>Ordered at: {new Date(order.createdAt).toLocaleString()}</p>
                <ul className={styles.orderItems}>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.dishName} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}