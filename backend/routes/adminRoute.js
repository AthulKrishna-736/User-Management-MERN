import express from 'express';
import { verifyAdmin } from '../middlewares/auth.js';
import { getAllUsers, createUser, updateUser, deleteUser, upload , getUserById, } from '../controllers/adminController.js';

const adminRoute = express.Router();

// Only allow admin users to access these routes
adminRoute.get('/users', verifyAdmin, getAllUsers);
adminRoute.get('/users/:id', verifyAdmin, getUserById); 
adminRoute.post('/users', verifyAdmin, upload.single('profileImage'),createUser);
adminRoute.put('/users/:id', verifyAdmin, upload.single('profileImage'), updateUser); 
adminRoute.delete('/users/:id', verifyAdmin, deleteUser);

export default adminRoute;
