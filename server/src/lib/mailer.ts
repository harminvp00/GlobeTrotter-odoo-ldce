import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true', // false for port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (toEmail: string, resetToken: string): Promise<void> => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"GlobeTrotter Support" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Password Reset Request - GlobeTrotter',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; borderRadius: 8px;">
        <h2 style="color: #4F46E5;">GlobeTrotter Password Reset</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password for your GlobeTrotter account.</p>
        <p>Please click the button below to reset your password. This link is valid for 1 hour:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this URL into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666666;">If you did not request a password reset, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
