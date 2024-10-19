import userCollection from "../models/userModel.js";
import multer from 'multer'
import bcrypt from 'bcrypt'
import jwt, { decode } from 'jsonwebtoken'

//multer configuration
const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, './uploads');
    },
    filename:(req, file, cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

//initialize multer
const upload = multer({storage: storage});

const signUpUser = async (req, res) => {
    const { username, email, phone, password } = req.body;
    console.log(req.body)
    const profileImagePath = req.file ? req.file.path : null;

    try {
        const userExist = await userCollection.findOne({email})

        if(userExist){
            return res.status(400).json({message:'Email already in use. Please use different one.'})
        }

        const hashedPass = await bcrypt.hash(password, 10)
        console.log(hashedPass)

        const newUser = new userCollection({
            username,
            email,
            phone,
            password:hashedPass,
            profileImage: profileImagePath,
            isAdmin:false,
        });

        console.log('user is being signed up')
        const response = await newUser.save();
        console.log('User signedup successfully',response)

        res.status(201).json({message: 'User create successfully'})

    } catch (error) {
        res.status(500).json({message: 'Error creating user'});
    }
}

const loginUser = async (req, res)=>{
    try {
        console.log(req.body.email)
        const { email, password } = req.body;
    
        const userExist = await userCollection.findOne({email});

        if(!userExist){
            return res.status(404).json({email_message:'User not found please Signup'})
        }

        const passMatch = await bcrypt.compare(password, userExist.password)
        console.log(passMatch)

        if(!passMatch){
            return res.status(404).json({pass_message:'Invalid password'})
        }

        //jwt token feature
        const payload = {
            userId: userExist._id,
            username: userExist.username,
            isAdmin: userExist.isAdmin,
        };
        console.log('token created and sent to frontend')
        //creating a token
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '2h'});

        //sending username and also the token
        res.status(200).json({message:'Login successfull', user:userExist.username, token, isAdmin:userExist.isAdmin, adminName:userExist.username, adminProfilePic:userExist.profileImage})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:'Server error'})
        
    }
}

const successLogin = (req, res)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: 'Unauthorized. Please log in.', isAuth: false});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token ,process.env.JWT_SECRET_KEY);
        console.log('decoded result', decoded)

        return res.status(200).json({message: 'Welome to the protected route!', userId: decoded.userId, isAdmin:decoded.isAdmin})

    } catch (error) {
        return res.status(401).json({message:'Unauthorized. Invalid or expired token.', isAuth: false})
    }
}

const userDetails = async (req, res) => {
    try {
        const user = await userCollection.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send user details including profile picture
        res.status(200).json(user);

    } catch (error) {
        console.log('Error fetching the user details', error);
        res.status(500).json({message: 'Failed to fetch the user details'})
    }
}

const profileUpdate = async (req, res)=>{
    const userId = req.userId; // Get userId from the middleware
    console.log('user: ',userId)
    const updates = {};

    if (req.body.username) {
        updates.username = req.body.username;
    }
    if (req.body.phone) {
        updates.phone = req.body.phone;
    }
    if (req.file) {
        updates.profileImage = req.file.path; // Assuming you save the image path
    }

    try {
        // Update user with the provided data
        const updatedUser = await userCollection.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}


export {
    signUpUser,
    loginUser,
    upload,
    successLogin,
    userDetails,
    profileUpdate,
}