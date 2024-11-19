// app/admin/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from '@/lib/prisma';
import YearlyOverview from "@/app/admin/dashboard/YearlyOverview";

export default async function AdminDashboard() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  // Fetch yearly statistics
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  
  try {
    const [totalOrders, popularDishes, monthlyOrders] = await Promise.all([
      // Get total orders
      prisma.order.count({
        where: {
          createdAt: {
            gte: startOfYear,
          },
        },
      }),

      // Get popular dishes
      prisma.orderItem.groupBy({
        by: ['dishName'],
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
        },
        },
        take: 5,
        where: {
          order: {
            createdAt: {
              gte: startOfYear,
            },
          },
        },
      }),

      // Get monthly orders
      prisma.order.groupBy({
        by: ['createdAt'],
        _count: {
          id: true,
        },
        where: {
          createdAt: {
            gte: startOfYear,
          },
        },
      }),
    ]);

    const yearlyStats = {
      totalOrders,
      popularDishes: popularDishes.map(dish => ({
        ...dish,
        _sum: {
          quantity: dish._sum.quantity ?? 0,
        },
      })),
      monthlyOrders,
    };

    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <YearlyOverview stats={yearlyStats} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading dashboard data. Please try again later.
        </div>
      </div>
    );
  }
}