'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './MenuPage.module.css';
import OrderForm from '@/app/_components/OrderForm';
import { Allergy, allergyIcons, allergyNames } from '@/app/_lib/allergies';

interface Dish {
  id: number;
  name: string;
  image: string;
  allergies: Allergy[];
  category: string;
  subcategory?: string;
}

interface OrderItem extends Dish {
  quantity: number;
}

const categories = ['All', 'Appetizers', 'Main Courses', 'Side Dishes', 'Desserts', 'Drinks'];
const drinkSubcategories = ['All Drinks', 'Alcoholic', 'Non-Alcoholic', 'Hot Beverages'];

function MenuContent({ initialTableNumber }: { initialTableNumber: string | null }) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState<string | null>(initialTableNumber);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDrinkSubcategory, setActiveDrinkSubcategory] = useState('All Drinks');
  const searchParams = useSearchParams();
  const [visibleDishes, setVisibleDishes] = useState<number[]>([]);

  useEffect(() => {
    setTableNumber(searchParams.get('table'));
  }, [searchParams]);

  const addToOrder = (dish: Dish) => {
    setOrder(currentOrder => {
      const existingItem = currentOrder.find(item => item.id === dish.id);
      if (existingItem) {
        return currentOrder.map(item =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentOrder, { ...dish, quantity: 1 }];
    });
  };

  const totalItems = order.reduce((sum, item) => sum + item.quantity, 0);

  const filteredDishes = dishes.filter(dish => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Drinks') {
      return dish.category === 'Drinks' && (activeDrinkSubcategory === 'All Drinks' || dish.subcategory === activeDrinkSubcategory);
    }
    return dish.category === activeCategory;
  });

  useEffect(() => {
    setVisibleDishes([]);
    const timer = setTimeout(() => {
      setVisibleDishes(filteredDishes.map(dish => dish.id));
    }, 50);
    return () => clearTimeout(timer);
  }, [activeCategory, activeDrinkSubcategory, filteredDishes]);

  useEffect(() => {
    async function fetchDishes() {
      try {
        const response = await fetch('/api/dishes');
        if (!response.ok) {
          throw new Error('Failed to fetch dishes');
        }
        const data = await response.json();
        setDishes(data);
      } catch (error) {
        setError('Error loading menu items');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchDishes();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading menu...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Menu</h1>
      
      <button 
        className={styles.menuToggle} 
        onClick={() => setIsOrderMenuOpen(!isOrderMenuOpen)}
      >
        <span>{isOrderMenuOpen ? '×' : '☰'}</span>
      {!isOrderMenuOpen && totalItems > 0 && (
        <span className={styles.notificationBadge}>
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
      </button>

      <div className={`${styles.orderMenu} ${isOrderMenuOpen ? styles.open : ''}`}>
        {tableNumber && (
          <OrderForm order={order} setOrder={setOrder} tableNumber={Number(tableNumber)} />
        )}
      </div>

      <div className={styles.categoryTabs}>
        {categories.map(category => (
          <button
            key={category}
            className={`${styles.categoryTab} ${activeCategory === category ? styles.active : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {activeCategory === 'Drinks' && (
        <div className={styles.subcategoryTabs}>
          {drinkSubcategories.map(subcategory => (
            <button
              key={subcategory}
              className={`${styles.subcategoryTab} ${activeDrinkSubcategory === subcategory ? styles.active : ''}`}
              onClick={() => setActiveDrinkSubcategory(subcategory)}
            >
              {subcategory}
            </button>
          ))}
        </div>
      )}

      <div className={styles.menuGrid}>
        {filteredDishes.map((dish) => (
          <div 
            key={dish.id} 
            className={`${styles.dishCard} ${visibleDishes.includes(dish.id) ? styles.visible : ''}`}
          >
            <Image 
              src={dish.image} 
              alt={dish.name} 
              width={500} 
              height={500} 
              className={styles.dishImage}
            />
            <h3 className={styles.dishName}>{dish.name}</h3>
            <div className={styles.allergyIcons}>
              {dish.allergies.map((allergy) => (
                <span 
                  key={allergy} 
                  className={styles.allergyIcon} 
                  title={allergyNames[allergy]}
                >
                  {allergyIcons[allergy]}
                </span>
              ))}
            </div>
            <button onClick={() => addToOrder(dish)} className={styles.addButton}>
              Add to Round
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function MenuPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <MenuContent initialTableNumber={null} />;
}