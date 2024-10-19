import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoute from './routes/userRoute.js'
import adminRoute from './routes/adminRoute.js'

//loading env variables
dotenv.config();

const app = express()

//configuring port
const PORT = process.env.PORT || 5000;

//enabling cors from outer urls
const corsOptions = {
    origin: process.env.CORS_URL || '*',
    methods : 'GET,POST,PUT,DELETE',
    credentials: true,
};
app.use(cors(corsOptions));



//configuriing the session
app.use(session({
    secret:process.env.SECRET_KEY || 'secretkey',
    resave:false,
    saveUninitialized:true,
    cookie:{ secure:false } // 1 day 
}));

//middlewares to parse json and other files
app.use(express.json({ limit:'10mb' }));
app.use('/uploads', express.static('uploads'))

//Routes
app.use('/api/users',userRoute);
app.use('/admin', adminRoute)

//connecting mongo db locally
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>console.log('Mongodb connected successfully'))
    .catch((error)=> console.log('Mongodb connection error: ',error))

//default route for checking server    
app.get('/',(req, res)=>{
    res.send('hello world')
})

//starting of server
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})

