// File: app/admin/dashboard/YearlyOverview.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface YearlyOverviewProps {
  stats: {
    totalOrders: number;
    popularDishes: Array<{
      dishName: string;
      _sum: { quantity: number };
    }>;
    monthlyOrders: Array<{
      createdAt: Date;
      _count: { id: number };
    }>;
  };
}

export default function YearlyOverview({ stats }: YearlyOverviewProps) {
  const monthlyData = stats.monthlyOrders.map(order => ({
    month: new Date(order.createdAt).toLocaleString('default', { month: 'short' }),
    orders: order._count.id
  }));

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Yearly Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.totalOrders}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Most Popular Dishes</h3>
            <ul className="space-y-2">
              {stats.popularDishes.map((dish) => (
                <li key={dish.dishName} className="flex justify-between">
                  <span>{dish.dishName}</span>
                  <span className="font-medium">
                    {dish._sum.quantity} orders
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Monthly Orders</h2>
        <div className="h-[400px]">
          <LineChart
            width={800}
            height={400}
            data={monthlyData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
}
