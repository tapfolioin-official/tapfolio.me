import nodemailer from 'nodemailer';

/**
 * Formats a premium Linear/Stripe-style branded HTML email template.
 */
function getVerificationEmailHtml(otp: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify your email address</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #0B1329;
            color: #F8FAFC;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #0F172A;
            border: 1px solid #1E293B;
            border-radius: 12px;
            padding: 40px 32px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
          }
          .logo {
            font-size: 24px;
            font-weight: 800;
            color: #3B82F6;
            margin-bottom: 24px;
            text-align: center;
            letter-spacing: -0.5px;
          }
          .title {
            font-size: 20px;
            font-weight: 700;
            color: #F8FAFC;
            margin-bottom: 16px;
            text-align: center;
            letter-spacing: -0.2px;
          }
          .text {
            font-size: 14px;
            line-height: 1.6;
            color: #94A3B8;
            margin-bottom: 24px;
            text-align: center;
          }
          .code-box {
            font-size: 36px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #3B82F6;
            background-color: #1E293B;
            padding: 20px 24px;
            border-radius: 8px;
            text-align: center;
            margin: 28px 0;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            border: 1px solid #334155;
          }
          .footer {
            font-size: 12px;
            color: #64748B;
            text-align: center;
            margin-top: 36px;
            border-top: 1px solid #1E293B;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">⚡ Tapfolio</div>
          <div class="title">Verify your email address</div>
          <div class="text">
            Thank you for registering on Tapfolio. Use the verification code below to verify your email address. This code is valid for 10 minutes.
          </div>
          <div class="code-box">${otp}</div>
          <div class="text">
            If you did not request this code, you can safely ignore this email.
          </div>
          <div class="footer">
            &copy; 2026 Tapfolio, Inc. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Sends the verification code to the target email.
 * Supports SMTP (Nodemailer), Resend API, and falls back to terminal console logs.
 */
export async function sendVerificationEmail(email: string, otp: string): Promise<boolean> {
  const smtpUser = process.env.SMTP_USER || 'tapfolio.in@gmail.com';
  const smtpPass = process.env.SMTP_PASS; // App Password (e.g. Gmail App Password)
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  
  const resendApiKey = process.env.RESEND_API_KEY;

  // 1. SMTP Mode (Gmail/tapfolio.in@gmail.com app passwords)
  if (smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // Use SSL/TLS for port 465, STARTTLS for port 587
        auth: {
          user: smtpUser,
          pass: smtpPass.replace(/\s+/g, ''),
        },
      });

      await transporter.sendMail({
        from: `"Tapfolio Verification" <${smtpUser}>`,
        to: email,
        subject: 'Verify your email address',
        html: getVerificationEmailHtml(otp),
      });

      console.log(`[SMTP] Verification email sent to ${email} via ${smtpUser}`);
      return true;
    } catch (error) {
      console.error('SMTP delivery failed:', error);
      // Fallback to other senders
    }
  }

  // 2. Resend API Mode
  if (resendApiKey) {
    try {
      const fromEmail = process.env.EMAIL_FROM || `Tapfolio Verification <${smtpUser}>`;
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          subject: 'Verify your email address',
          html: getVerificationEmailHtml(otp),
        }),
      });

      if (res.ok) {
        console.log(`[Resend] Verification email sent to ${email}`);
        return true;
      }
      const errText = await res.text();
      console.error('Resend delivery failed:', errText);
    } catch (error) {
      console.error('Resend fetch error:', error);
    }
  }

  console.error(`[Email Error] No email provider configured, or all delivery attempts failed for email=${email}`);
  return false;
}
