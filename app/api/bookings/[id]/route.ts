import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendBookingConfirmation, sendBookingCancellation } from '@/lib/email';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || !['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update booking
    const booking = await prisma.booking.update({
      where: { id },
      data: { status }
    });

    // Send email notification based on status change
    if (status === 'CONFIRMED') {
      await sendBookingConfirmation(booking);
    } else if (status === 'CANCELLED') {
      await sendBookingCancellation(booking);
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
} 