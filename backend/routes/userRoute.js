import express from 'express';
import { loginUser, profileUpdate, signUpUser, successLogin, upload, userDetails } from '../controllers/userController.js'
import { verifyUser } from '../middlewares/auth.js';

const userRoute = express.Router();

userRoute.post('/signup', upload.single('profileImage'), signUpUser);
userRoute.post('/login', loginUser);
userRoute.get('/check-auth', successLogin)
userRoute.get('/me', verifyUser, userDetails)
userRoute.put('/me', verifyUser, upload.single('profileImage'),profileUpdate)


export default userRoute;