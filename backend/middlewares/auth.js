import jwt from 'jsonwebtoken'


const verifyUser = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    console.log('auth middle header: ',authHeader) 

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: 'User is not authorized'})
    }
    const token = authHeader.split(' ')[1];

    console.log('token middleware structure', token.split('.'))

    try {
        console.log('jwt key = ',process.env.JWT_SECRET_KEY)
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log('middleware decoded :', decoded)
        req.userId = decoded.userId;
        next();

    } catch (error) {
        console.log('token middleware verification failed', error.message)
        res.status(401).json({message: 'invalid token!'})
    }

};

 const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        req.userId = decoded.userId; // Attach user ID to request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
    }
};


export {
    verifyUser,
    verifyAdmin
}