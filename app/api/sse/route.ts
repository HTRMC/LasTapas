// File: app/api/sse/route.ts

import { NextRequest, NextResponse } from 'next/server';
import eventEmitter from '@/app/_lib/eventEmitter';

const clients = new Set<ReadableStreamDefaultController>();

eventEmitter.on('newSubmission', () => {
  for (const client of clients) {
    client.enqueue('data: newSubmission\n\n');
  }
});

eventEmitter.on('newOrder', () => {
  for (const client of clients) {
    client.enqueue('data: newOrder\n\n');
  }
});

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller);

      req.signal.addEventListener('abort', () => {
        clients.delete(controller);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}