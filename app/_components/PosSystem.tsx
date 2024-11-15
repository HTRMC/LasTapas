import { useState, useEffect } from 'react';
import styles from '@/app/_components/PosSystem.module.css';

interface OrderItem {
  id: number;
  dishId: number;
  dishName: string;
  quantity: number;
  orderId: number;
}

interface Order {
  id: number;
  tableNumber: number;
  createdAt: string;
  items: OrderItem[];
  isPaid: boolean;
  paidAt?: string;
}

interface TableOrders {
  [key: number]: Order[];
}

const PosSystem = () => {
  const [tables, setTables] = useState<TableOrders>({});
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/submissions');
      if (response.ok) {
        const data = await response.json();
        // Group orders by table number and filter unpaid orders
        const tableOrders = data.orders.reduce((acc: TableOrders, order: Order) => {
          if (!order.isPaid) {  // Only show unpaid orders
            if (!acc[order.tableNumber]) {
              acc[order.tableNumber] = [];
            }
            acc[order.tableNumber].push(order);
          }
          return acc;
        }, {});
        setTables(tableOrders);
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

  const dummyPrices: { [key: number]: number } = {
    1: 20, 2: 8, 3: 10, 4: 8, 5: 12, 6: 9, 
    7: 18, 8: 12, 9: 7, 10: 8, 11: 6, 12: 4, 13: 3
  };

  const calculateTableTotal = (orders: Order[]) => {
    return orders.reduce((sum, order) => {
      const orderTotal = order.items.reduce((itemSum: number, item: OrderItem) => {
        return itemSum + (dummyPrices[item.dishId] || 0) * item.quantity;
      }, 0);
      return sum + orderTotal;
    }, 0);
  };

  useEffect(() => {
    if (selectedTable !== null && tables[selectedTable]) {
      setTotal(calculateTableTotal(tables[selectedTable]));
    } else {
      setTotal(0);
    }
  }, [selectedTable, tables]);

  const printReceipt = () => {
    if (!selectedTable || !tables[selectedTable]) return;

    const orders = tables[selectedTable];
    const receiptContent = `
      Las Tapas Restaurant
      --------------------------------
      Table: ${selectedTable}
      Date: ${new Date().toLocaleString()}
      --------------------------------
      ${orders.map(order => `
        Order #${order.id}
        ${order.items.map((item: OrderItem) => 
          `${item.quantity}x ${item.dishName.padEnd(20)} €${((dummyPrices[item.dishId] || 0) * item.quantity).toFixed(2)}`
        ).join('\n')}
      `).join('\n--------------------------------\n')}
      --------------------------------
      Total: €${total.toFixed(2)}
      --------------------------------
      Thank you for dining with us!
    `.replace(/^ +/gm, '');  // Remove leading spaces

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <pre style="font-family: monospace; font-size: 14px;">
          ${receiptContent}
        </pre>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const processPayment = async () => {
    if (!selectedTable) return;
    
    setProcessing(true);
    try {
      const response = await fetch('/api/mark-paid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableNumber: selectedTable }),
      });

      if (response.ok) {
        const newTables = { ...tables };
        delete newTables[selectedTable];
        setTables(newTables);
        setSelectedTable(null);
        alert('Payment processed successfully!');
      } else {
        throw new Error('Failed to process payment');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Error processing payment: ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>POS System</h1>
      
      <div className={styles.tableGrid}>
        {Object.keys(tables).map((tableNum) => (
          <button
            key={tableNum}
            onClick={() => setSelectedTable(Number(tableNum))}
            className={`${styles.tableCard} ${
              selectedTable === Number(tableNum)
                ? styles.tableCardActive
                : styles.tableCardInactive
            }`}
          >
            <div className={styles.orderNumber}>Table {tableNum}</div>
            <div className={styles.quantity}>
              {tables[Number(tableNum)].reduce((sum, order) => 
                sum + order.items.reduce((itemSum: number, item: OrderItem) => itemSum + item.quantity, 0)
              , 0)} items
            </div>
            <div className={styles.orderNumber}>
              €{calculateTableTotal(tables[Number(tableNum)]).toFixed(2)}
            </div>
          </button>
        ))}
      </div>
  
      {selectedTable !== null && tables[selectedTable] && (
        <div className={styles.orderSection}>
          <h2 className={styles.orderHeader}>Table {selectedTable} Orders</h2>
          
          <div className={styles.orderList}>
            {tables[selectedTable].map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderInfo}>
                  <h3 className={styles.orderNumber}>Order #{order.id}</h3>
                  <span className={styles.orderTime}>
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <ul className={styles.itemList}>
                  {order.items.map((item) => (
                    <li key={item.id} className={styles.item}>
                      <span className={styles.itemName}>{item.quantity}x {item.dishName}</span>
                      <span className={styles.itemName}>
                        €{((dummyPrices[item.dishId] || 0) * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
  
          <div className={styles.totalSection}>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            
            <div className={styles.buttonGroup}>
              <button 
                onClick={processPayment}
                disabled={processing}
                className={styles.payButton}
              >
                {processing ? 'Processing...' : 'Mark as Paid'}
              </button>
              <button 
                onClick={printReceipt}
                className={styles.printButton}
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosSystem;