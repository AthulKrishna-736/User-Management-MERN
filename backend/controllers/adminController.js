import userCollection from '../models/userModel.js';
import multer from 'multer';
import bcrypt from 'bcrypt'

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

const getAllUsers = async (req, res) => {
    try {
        const users = await userCollection.find({ isAdmin:false });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

const createUser = async (req, res) => {
    console.log('req body in cs = ',req.body)
    const { username, email, phone, password } = req.body;
    const profileImagePath = req.file ? req.file.path : null;

    try{
        const userExist = await userCollection.findOne({email});

        if(userExist){
            return res.status(400).json({message:'Email is already in use. Please use different one.'})
        }

        const hashedPass = await bcrypt.hash(password,10);

        const newUser = new userCollection({
            username,
            email,
            phone,
            password: hashedPass,
            profileImage: profileImagePath,
            isAdmin: false,
        });

        await newUser.save()
        res.status(201).json({message: 'User created successfully'});

    }
    catch(error){
        console.log('error creating user',error)
        return res.status(500).json({message: 'Error creating user', error});
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('user id = ',userId)
        const { username, phone } = req.body;

        const updatedUser = await userCollection.findByIdAndUpdate(userId, { username, phone, profileImage: req.file.path }, { new: true });

        if(!updatedUser){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json(updatedUser)

    } catch (error) {
        console.error('error updating user',error)
        res.status(500).json({message: 'server error'})
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await userCollection.findByIdAndDelete(id);
        return res.status(200).json({message:'User deleted successfully'})

    } catch (error) {
        console.error('error deleting user: ',error)
        return res.status(500).json({message: 'server error while deleting user'})
    }
};

const getUserById = async(req, res)=>{
    try {
        const userId = req.params.id;
        const user = await userCollection.findById(userId)

        if(!user){
            return res.status(404).json({message:'User not found'})
        }

        res.status(200).json(user);

    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
}


export { 
    getAllUsers, 
    createUser, 
    updateUser, 
    deleteUser,
    upload,
    getUserById,
};
