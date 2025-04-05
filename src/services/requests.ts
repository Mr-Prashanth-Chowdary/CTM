import axios from 'axios';
import APIError from '../errors/APIError';

export async function sendOtpMail(
    to: string, 
    subject: string,
    text: string
) {
    try {
        const response = await axios.post(`${process.env.MAIL_SERVICES}/send-otp`, {
            to,
            subject,
            text
        });

        if (response.status !== 200) {
            throw new APIError('OTP_SEND_FAILED', 'Failed to send OTP email');
        }
        return response.data;
    } catch (error: any) {
        console.error('OTP Mail Send Error:', error.response?.data || error.message);
        throw new APIError('OTP_SEND_FAILED', error.response?.data?.message || 'Failed to send OTP');
    }
}
