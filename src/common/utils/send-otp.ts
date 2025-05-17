import { sendEmail } from '@/common/utils/email';

export const sendOtpToEmail = async (to: string, otp: string) => {
    const subject = 'Your OTP Code';
    const text = `Your verification code is: ${otp}. It expires after 1 day.`;
    const html = `
    <h3>Verify Your Email</h3>
    <p>Your OTP is:</p>
    <h2>${otp}</h2>
    <p>Please use this code to verify your email. Do not share it.</p>
  `;

    return await sendEmail(to, subject, text, html);
};
