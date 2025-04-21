import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendNewBookingNotification } from '@/lib/email';

// Best practice: Create a single PrismaClient instance and reuse it
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, eventType, eventDate, details } = body;

    // Validate required fields
    if (!name || !email || !eventType || !eventDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        eventType,
        eventDate: new Date(eventDate),
        details,
        status: 'PENDING' // Default status
      }
    });

    // Send email notifications
    await sendNewBookingNotification(booking);

    return NextResponse.json(
      { message: 'Booking created successfully', booking },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 