// app/api/mark-paid/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { tableNumber } = await req.json();

  try {
    await prisma.order.updateMany({
      where: {
        tableNumber,
        isPaid: false,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking orders as paid:', error);
    return NextResponse.json({ success: false, error: 'Failed to mark orders as paid' }, { status: 500 });
  }
}