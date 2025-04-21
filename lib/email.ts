import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type Booking = {
  id: string;
  name: string;
  email: string;
  eventType: string;
  eventDate: Date;
  details?: string | null;
};

export async function sendBookingConfirmation(booking: Booking) {
  const { name, email, eventType, eventDate } = booking;
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  await resend.emails.send({
    from: 'NextSpin <onboarding@resend.dev>',
    to: email,
    subject: 'Your NextSpin Booking is Confirmed! 🎉',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Booking Confirmed!</h1>
        <p>Hi ${name},</p>
        <p>Great news! Your NextSpin 360 Photo Booth booking has been confirmed for your upcoming ${eventType}.</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Booking Details:</h2>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Event:</strong> ${eventType}</li>
            <li><strong>Date:</strong> ${formattedDate}</li>
          </ul>
        </div>

        <p>Our team will arrive 1 hour before your event to set up the booth and ensure everything runs smoothly.</p>
        
        <p>If you need to make any changes to your booking or have any questions, please don't hesitate to contact us at nextspinco@gmail.com</p>
        
        <p>Best regards,<br>The NextSpin Team</p>
      </div>
    `
  });
}

export async function sendBookingCancellation(booking: Booking) {
  const { name, email, eventType, eventDate } = booking;
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  await resend.emails.send({
    from: 'NextSpin <onboarding@resend.dev>',
    to: email,
    subject: 'NextSpin Booking Cancellation',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Booking Cancelled</h1>
        <p>Hi ${name},</p>
        <p>Your NextSpin 360 Photo Booth booking for the following event has been cancelled:</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <ul style="list-style: none; padding: 0;">
            <li><strong>Event:</strong> ${eventType}</li>
            <li><strong>Date:</strong> ${formattedDate}</li>
          </ul>
        </div>

        <p>If you believe this was done in error or would like to make a new booking, please contact us at nextspinco@gmail.com</p>
        
        <p>Best regards,<br>The NextSpin Team</p>
      </div>
    `
  });
}

export async function sendNewBookingNotification(booking: Booking) {
  const { name, email, eventType, eventDate, details } = booking;
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Send notification to admin
  try {
    console.log('Attempting to send admin notification...');
    const adminResponse = await resend.emails.send({
      from: 'NextSpin <onboarding@resend.dev>',
      to: 'acestudios.r@gmail.com', // Temporary for testing
      replyTo: email,
      subject: 'New Booking Request',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>New Booking Request</h1>
          <p>A new booking request has been submitted:</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Booking Details:</h2>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Event:</strong> ${eventType}</li>
              <li><strong>Date:</strong> ${formattedDate}</li>
              ${details ? `<li><strong>Additional Details:</strong> ${details}</li>` : ''}
            </ul>
          </div>

          <p>Please review and confirm this booking in the admin dashboard.</p>
        </div>
      `
    });
    console.log('Admin notification sent successfully:', adminResponse);
  } catch (adminError) {
    console.error('Error sending admin notification:', adminError);
    throw adminError;
  }

  // Send acknowledgment to customer
  try {
    console.log('Attempting to send customer notification...');
    const customerResponse = await resend.emails.send({
      from: 'NextSpin <onboarding@resend.dev>',
      to: email,
      replyTo: 'nextspinco@gmail.com',
      subject: "We've Received Your Booking Request! 📸",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Thanks for Your Booking Request!</h1>
          <p>Hi ${name},</p>
          <p>We've received your booking request for the NextSpin 360 Photo Booth. Our team will review your request and get back to you within 24 hours.</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Your Request Details:</h2>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Event:</strong> ${eventType}</li>
              <li><strong>Date:</strong> ${formattedDate}</li>
            </ul>
          </div>

          <p>If you need to make any changes to your request, please contact us at nextspinco@gmail.com</p>
          
          <p>Best regards,<br>The NextSpin Team</p>
        </div>
      `
    });
    console.log('Customer notification sent successfully:', customerResponse);
  } catch (customerError) {
    console.error('Error sending customer notification:', customerError);
    throw customerError;
  }
} 