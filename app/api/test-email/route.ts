import { NextResponse } from 'next/server';
import { sendNewBookingNotification } from '@/lib/email';

export async function GET() {
  try {
    // Create a test booking object
    const testBooking = {
      id: 'test-id',
      name: 'Test User',
      email: 'connryan11@gmail.com',
      eventType: 'Test Event',
      eventDate: new Date('2024-12-25'),
      details: 'This is a test booking to verify email functionality'
    };

    console.log('Attempting to send email notifications...');
    
    try {
      // Send test email with separate try-catch to identify which email fails
      await sendNewBookingNotification(testBooking);
      console.log('Email notifications sent successfully');
    } catch (emailError) {
      console.error('Error in sendNewBookingNotification:', emailError);
      throw emailError;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully' 
    });
  } catch (error) {
    console.error('Error in test-email route:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send test email',
      details: error
    }, { 
      status: 500 
    });
  }
} 