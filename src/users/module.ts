import APIError from "../errors/APIError";
import { User } from '../models/UserModel'
import { UserRole } from '../models/UserRoles'
import { ForgetPass } from "../models/ForgetPassModel";
import { Login } from "../models/LoginModel";
import { sendOtpMail } from "../services/requests";
import { generateOTP, generateToken } from "../utils/secratekeyGenrators";
import bcrypt from 'bcrypt'



export async function createUser(
    username: string, 
    email: string, 
    password: string,
    role: string,
){
    try{
        if(!username || !email || !password || !role){
            throw new APIError(`MISSING_DETAILS`,`Must provide necessary details`)
        }
        const existingUser = await User.findOne({email: email});
        if(existingUser){
            throw new APIError(
                `USER_EXISTS`,
                `User with this eamil id already exists`,
            );
        }
        const SALT_ROUNDS = 10;
        const password_hash = await bcrypt.hash(password,SALT_ROUNDS);
        const user: any = await User.insertOne({
            username,
            email,
            password: password_hash,
        })
        const userRole: any = await UserRole.insertOne({
            user_id : user._id,
            role: role
        })

        return {user,userRole}
    }catch(error: any){
        console.error(error)
        throw new APIError(error.code,error.message)
    }
}

export async function loginUser(
    email: string,
    password: string
) {
    try {
        if (!email || !password) {
            throw new APIError(`MISSING_DETAILS`, `Must provide necessary details`);
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new APIError(`USER_NOT_EXISTS`, `User record with this email does not exist`);
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new APIError(`INVALID_PASSWORD`, `Incorrect password`);
        }
        const userRole = await UserRole.findOne({ user_id: user._id });
        if (!userRole) {
            throw new APIError(`ROLE_NOT_FOUND`, `User role not found`);
        }

        const token = generateToken(user._id.toString(), userRole.role);

        // update Login data 
        await Login.insertOne({user_id:user._id,access_token: token,access_token_exp: new Date(Date.now() + 24 * 60 * 60 * 1000),is_active: true,})
        return { token, user, role: userRole.role };
    } catch (error: any) {
        console.error(error);
        throw new APIError(error.code || "LOGIN_FAILED", error.message || "Login failed");
    }
}

export async function forgotPass(
    email: string
){
    try{
        if (!email){
            throw new APIError(`MISSING_DETAILS`, `Must provide necessary details`);
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new APIError(`USER_NOT_EXISTS`, `User with this email does not exist`);
        }
       
        const otp = generateOTP();
        const exp_time = new Date(Date.now() + 10 * 60 * 1000); // exp_time for 10mins
        await ForgetPass.findOneAndUpdate(
            { user_id: user._id },
            { otp, exp_time },
            { upsert: true, new: true }
        );

        const subject = "yout OTP one time password"
        await sendOtpMail(email, subject, otp);
        return { message: 'OTP has been sent to your email.' };
    } catch (error: any) {
        console.error(error);
        throw new APIError(error.code || "FORGOT_PASSWORD_FAILED", error.message || "Something went wrong");
    }
}

export async function verifyOtp(email: string, otp: string) {
    try {
        if (!email || !otp) {
            throw new APIError('MISSING_DETAILS', 'Email and OTP are required');
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new APIError('USER_NOT_FOUND', 'User not found');
        }

        const otpRecord = await ForgetPass.findOne({ user_id: user._id });

        if (!otpRecord) {
            throw new APIError('OTP_NOT_FOUND', 'No OTP request found for this user');
        }

        if (otpRecord.otp !== otp) {
            throw new APIError('INVALID_OTP', 'The OTP entered is incorrect');
        }

        if (new Date() > new Date(otpRecord.exp_time)) {
            throw new APIError('OTP_EXPIRED', 'The OTP has expired');
        }

        const token = generateToken(user._id,user.role)
        return { token, message: 'OTP verified successfully' };

    } catch (error: any) {
        console.error(error);
        throw new APIError(error.code || 'OTP_VERIFICATION_FAILED', error.message || 'OTP verification failed');
    }
}


export async function resetPassword(userId: string, newPassword: string) {
    try {
        if (!userId || !newPassword) {
            throw new APIError('MISSING_DETAILS', 'User ID and new password are required');
        }

        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new APIError('USER_NOT_FOUND', 'User not found');
        }

        const SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        await User.updateOne({ _id: userId }, { $set: { password: hashedPassword } });

        // Optional: remove the OTP record after successful reset
        await ForgetPass.deleteOne({ user_id: userId });

        return { message: 'Password has been reset successfully' };
    } catch (error: any) {
        console.error(error);
        throw new APIError(error.code || 'RESET_PASSWORD_FAILED', error.message || 'Password reset failed');
    }
}



export async function logout(userId: string) {
    try {
        const result = await Login.updateMany(
            { user_id: userId, is_active: true },
            {
                $set: {
                    is_active: false,
                    updated_at: new Date()
                }
            }
        );

        if (result.modifiedCount === 0) {
            throw new APIError('LOGOUT_FAILED', 'No active sessions found to logout');
        }

        return { message: 'Logout successful' };
    } catch (error: any) {
        console.error(error);
        throw new APIError(error.code || 'LOGOUT_ERROR', error.message || 'Logout failed');
    }
}





