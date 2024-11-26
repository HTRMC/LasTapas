// File: app/api/dishes/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/dishes
export async function GET() {
  try {
    const dishes = await prisma.dish.findMany({
      where: { active: true },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return NextResponse.json({ error: 'Failed to fetch dishes' }, { status: 500 });
  }
}

// POST /api/dishes
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const dish = await prisma.dish.create({ data });
    return NextResponse.json(dish);
  } catch (error) {
    console.error('Error creating dish:', error);
    return NextResponse.json({ error: 'Failed to create dish' }, { status: 500 });
  }
}