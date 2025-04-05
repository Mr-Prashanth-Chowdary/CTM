import JWT from 'jsonwebtoken'


const JWT_SECRET: string = process.env.JWT_SECRET || `DEFULT_SECRETE`

export function generateOTP(length = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return otp;
}

export function generateToken(userId: string, userRole: string) {
    return JWT.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });
}
