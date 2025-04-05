import {Router} from 'express'
import { createUser, forgotPass, loginUser, resetPassword, verifyOtp } from './module';
import { authenticateJWT } from '../middlewares/jwtExtractor';
const userRoute = Router()

userRoute.post('/register',async(req,res)=>{
    try{
        const {username,email, password,role} = req.body;
        const response = await createUser(
            username,
            email,
            password,
            role
        )
        res.status(201).send(response)
    }
    catch(error:any ){
        console.error(error)
    }
});

userRoute.post('/login',async(req,res)=>{
    try{
        const {email,password} = req.body;
        const response = await loginUser(
            email,
            password
        )
        res.status(200).send(response)
    }
    catch(error:any){
        console.error(error)
    }
})


userRoute.post('/forgotpass',async(req,res)=>{
    try{
        const {email} = req.body;
        const response = await forgotPass(
            email
        )
        res.status(200).send(response)
    }catch(error:any){
        console.error(error)
    }
})

userRoute.post('/verifyOtp',async(req,res)=>{
    try{
        const {email,otp} = req.body;
        const response = await verifyOtp(
            email,
            otp
        )
        res.status(200).send(response)
    }
    catch(error:any){
        console.error(error)
    }
})

userRoute.post('/restPassword',authenticateJWT,async(req,res)=>{
   try{ 
    const {userId, newPassword}  = req.body;
    const response = await resetPassword( 
        userId,
        newPassword
    )
    res.send(201).send(response)
    }
    catch(error:any){
        console.error(error)
    }
})

export = userRoute