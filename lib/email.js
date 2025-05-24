// lib/email.js
import nodemailer from 'nodemailer';

// Create transporter (configure with your email provider)
const createTransporter = () => {
  // Check if we have email credentials
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('Email credentials not configured. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    // For Gmail with App Password
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your-email@gmail.com
      pass: process.env.EMAIL_PASSWORD, // your app password (16 characters)
    },
    // Alternative: Gmail with OAuth2 (more secure)
    // service: 'gmail',
    // auth: {
    //   type: 'OAuth2',
    //   user: process.env.EMAIL_USER,
    //   clientId: process.env.GMAIL_CLIENT_ID,
    //   clientSecret: process.env.GMAIL_CLIENT_SECRET,
    //   refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    // },
    
    // Alternative: Use other SMTP providers
    // host: 'smtp.gmail.com',
    // port: 587,
    // secure: false, // true for 465, false for other ports
    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    
    // Alternative: Using other email services
    // Outlook/Hotmail
    // service: 'hotmail',
    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    
    // Custom SMTP (like SendGrid, Mailgun, etc.)
    // host: process.env.SMTP_HOST,
    // port: parseInt(process.env.SMTP_PORT || '587'),
    // secure: process.env.SMTP_SECURE === 'true',
    // auth: {
    //   user: process.env.SMTP_USER,
    //   pass: process.env.SMTP_PASS,
    // },
  });
};

// Email templates
const getWelcomeEmailTemplate = (name, role) => {
  const roleMessages = {
    farmer: {
      title: "Welcome to NTDM Animal Hospital - Your Animal Care Partner!",
      greeting: "Dear Livestock Owner",
      content: `
        <p>We're excited to welcome you to NTDM Animal Hospital, where we provide innovative solutions for livestock and pet owners.</p>
        <p>As a registered farmer/pet owner, you now have access to:</p>
        <ul style="margin: 15px 0; padding-left: 20px;">
          <li>🐄 Advanced animal tracking and health monitoring</li>
          <li>👨‍⚕️ Expert veterinary consultations</li>
          <li>📊 Comprehensive care management tools</li>
          <li>📱 24/7 access to your animal health records</li>
          <li>🔔 Health alerts and vaccination reminders</li>
        </ul>
        <p>Start by adding your animals to your profile and scheduling your first consultation if needed.</p>
      `
    },
    doctor: {
      title: "Welcome to NTDM Animal Hospital - Veterinary Professional Portal",
      greeting: "Dear Dr.",
      content: `
        <p>Welcome to the NTDM Animal Hospital veterinary platform! We're thrilled to have you join our network of animal care professionals.</p>
        <p>As a registered veterinarian, you can now:</p>
        <ul style="margin: 15px 0; padding-left: 20px;">
          <li>👥 Connect with farmers and pet owners in your area</li>
          <li>📅 Manage your consultation schedule and availability</li>
          <li>🩺 Conduct remote consultations and health assessments</li>
          <li>📋 Access comprehensive animal health records</li>
          <li>💊 Provide treatment recommendations and prescriptions</li>
        </ul>
        <p>Your expertise is valuable to our community. Please ensure your availability schedule is up to date.</p>
      `
    },
    admin: {
      title: "Welcome to NTDM Animal Hospital - Administrator Access",
      greeting: "Dear Administrator",
      content: `
        <p>Welcome to the NTDM Animal Hospital administrative portal.</p>
        <p>You now have full access to manage the platform and support our community of farmers and veterinarians.</p>
        <p>Your administrative privileges include platform oversight, user management, and system monitoring.</p>
      `
    }
  };

  const template = roleMessages[role] || roleMessages.farmer;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${template.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 30px 20px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0 0 0;
          opacity: 0.9;
          font-size: 14px;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-top: none;
        }
        .greeting {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .cta-button {
          display: inline-block;
          background: #2563eb;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          background: #f9fafb;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 8px 8px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
        ul li {
          margin: 8px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏥 NTDM Animal Hospital</h1>
        <p>Track, Consult, and Care for Your Animals</p>
      </div>
      
      <div class="content">
        <div class="greeting">${template.greeting} ${name}!</div>
        
        ${template.content}
        
        <div style="margin: 25px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.vettrack.rw'}/login" class="cta-button">
            Access Your Account
          </a>
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>The NTDM Animal Hospital Team</strong><br>
          <em>Innovative solutions for comprehensive animal care</em>
        </p>
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} NTDM Animal Hospital. All rights reserved.</p>
        <p>This email was sent because you created an account with us.</p>
        <p>If you didn't create this account, please contact us immediately.</p>
      </div>
    </body>
    </html>
  `;
};

// Send welcome email function
export const sendWelcomeEmail = async (userEmail, userName, userRole) => {
  try {
    const transporter = createTransporter();
    
    // If no transporter (missing credentials), skip email
    if (!transporter) {
      console.log('Email service not configured. Skipping welcome email.');
      return { success: false, error: 'Email service not configured' };
    }
    
    const template = getWelcomeEmailTemplate(userName, userRole);
    const roleMessages = {
      farmer: "Welcome to NTDM Animal Hospital - Your Animal Care Partner!",
      doctor: "Welcome to NTDM Animal Hospital - Veterinary Professional Portal",
      admin: "Welcome to NTDM Animal Hospital - Administrator Access"
    };
    
    const subject = roleMessages[userRole] || roleMessages.farmer;

    const mailOptions = {
      from: {
        name: 'NTDM Animal Hospital',
        address: process.env.EMAIL_USER
      },
      to: {
        name: userName,
        address: userEmail
      },
      subject: subject,
      html: template,
      // Important headers to avoid spam
      headers: {
        'X-Priority': '3',
        'X-Mailer': 'NTDM Animal Hospital System',
        'Reply-To': process.env.EMAIL_USER,
        'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=Unsubscribe>`,
        'X-Entity-ID': 'ntdm-animal-hospital',
        'Message-ID': `<${Date.now()}-${Math.random().toString(36).substr(2, 9)}@ntdm2050@gmail.com>`
      },
      // Add text version (very important for spam filters)
      text: `
Welcome to NTDM Animal Hospital, ${userName}!

Track, Consult, and Care for Your Animals

Dear ${userRole === 'doctor' ? 'Dr.' : ''} ${userName},

Thank you for joining NTDM Animal Hospital! We provide innovative solutions for livestock and pet owners with advanced tracking, expert consultations, and comprehensive care - all in one place.

${userRole === 'farmer' ? `
As a registered farmer/pet owner, you now have access to:
- Advanced animal tracking and health monitoring
- Expert veterinary consultations  
- Comprehensive care management tools
- 24/7 access to your animal health records
- Health alerts and vaccination reminders

Start by adding your animals to your profile and scheduling your first consultation if needed.
` : userRole === 'doctor' ? `
As a registered veterinarian, you can now:
- Connect with farmers and pet owners in your area
- Manage your consultation schedule and availability
- Conduct remote consultations and health assessments
- Access comprehensive animal health records
- Provide treatment recommendations and prescriptions

Your expertise is valuable to our community. Please ensure your availability schedule is up to date.
` : ''}

Access Your Account: ${process.env.NEXT_PUBLIC_APP_URL || 'https://www.vettrack.rw'}/login

If you have any questions or need assistance, please don't hesitate to contact our support team.

Best regards,
The NTDM Animal Hospital Team
Innovative solutions for comprehensive animal care

© ${new Date().getFullYear()} NTDM Animal Hospital. All rights reserved.
This email was sent because you created an account with us.
If you didn't create this account, please contact us immediately.

To unsubscribe, reply to this email with "Unsubscribe" in the subject.
      `.trim(),
      // Additional options to improve deliverability
      envelope: {
        from: process.env.EMAIL_USER,
        to: userEmail
      },
    
    
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Optional: Send email verification (for future use)
export const sendVerificationEmail = async (userEmail, userName, verificationToken) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.vettrack.rw'}/verify-email?token=${verificationToken}`;
    
    const template = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .verify-button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
          .footer { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏥 NTDM Animal Hospital</h1>
          <p>Verify Your Email Address</p>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p>Thank you for registering with NTDM Animal Hospital. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="verify-button">Verify Email Address</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
          <p>This verification link will expire in 24 hours.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} NTDM Animal Hospital. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: {
        name: 'NTDM Animal Hospital',
        address: process.env.EMAIL_USER
      },
      to: userEmail,
      subject: 'Verify your email - NTDM Animal Hospital',
      html: template
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};