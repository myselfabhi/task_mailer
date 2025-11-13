import nodemailer from 'nodemailer';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// CORS headers - comprehensive for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400', // 24 hours
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      to_email, 
      from_email, 
      from_name, 
      subject, 
      html_content 
    } = body;

    // Validate required fields
    if (!to_email || !from_email || !from_name || !subject || !html_content) {
      return Response.json(
        { success: false, message: 'Missing required fields' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get SMTP configuration from environment variables
    // Default to Outlook/Office365 settings
    const smtpHost = process.env.SMTP_HOST || 'smtp.office365.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER || '';
    const smtpPassword = process.env.SMTP_PASSWORD || '';
    const smtpSecure = process.env.SMTP_SECURE === 'true'; // false for port 587, true for port 465

    if (!smtpUser || !smtpPassword) {
      return Response.json(
        { success: false, message: 'SMTP configuration is missing. Please set SMTP_USER and SMTP_PASSWORD environment variables.' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    // Verify connection
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail({
      from: `"${from_name}" <${from_email}>`,
      to: to_email,
      subject: subject,
      html: html_content,
    });

    return Response.json(
      { 
        success: true, 
        message: 'Email sent successfully',
        messageId: info.messageId 
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Email sending error:', error);
    return Response.json(
      { 
        success: false, 
        message: 'Failed to send email',
        error: error.message || 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

