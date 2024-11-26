// File: app/api/dishes/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/dishes/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const dish = await prisma.dish.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(dish);
  } catch (error) {
    console.error('Error updating dish:', error);
    return NextResponse.json({ error: 'Failed to update dish' }, { status: 500 });
  }
}

// DELETE /api/dishes/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete by setting active to false
    const dish = await prisma.dish.update({
      where: { id: parseInt(params.id) },
      data: { active: false },
    });
    return NextResponse.json(dish);
  } catch (error) {
    console.error('Error deleting dish:', error);
    return NextResponse.json({ error: 'Failed to delete dish' }, { status: 500 });
  }
}