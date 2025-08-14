import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, content, senderName } = await request.json();

    // Validate input
    if (!to || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, content' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Log the email sending attempt
    console.log('Email send attempt:', {
      to,
      subject,
      senderName: senderName || 'LAPIS Team',
      contentLength: content.length,
      timestamp: new Date().toISOString()
    });

    // For now, we'll simulate email sending
    // In production, you would integrate with email services like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer with SMTP

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success (you can change this to test error scenarios)
    const success = Math.random() > 0.1; // 90% success rate

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully',
        details: {
          to,
          subject,
          sentAt: new Date().toISOString(),
          messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Example implementation with Nodemailer (commented out)
/*
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const mailOptions = {
  from: `"${senderName || 'LAPIS Team'}" <${process.env.SMTP_USER}>`,
  to,
  subject,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4a90e2;">LAPIS</h2>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
        ${content.replace(/\n/g, '<br>')}
      </div>
      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        This email was sent from LAPIS Video Production Agency
      </p>
    </div>
  `,
};

const info = await transporter.sendMail(mailOptions);
*/