import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // console.log("authHeader:", authHeader);
    // console.log("token:", token);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        // console.log("token:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded token:', decoded);
        const user = await User.findByPk(decoded.id);
        // console.log('User found:', user);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        req.user = user;
        next();

    } catch (error) {
         console.error('Error during authorization:', error);
         if (error instanceof jwt.TokenExpiredError) {
             return res.status(403).json({ message: 'Unauthorized: Token Expired', error: error.message });
         } else if (error instanceof jwt.JsonWebTokenError) {
           return res.status(403).json({ message: 'Unauthorized: Invalid Token', error: error.message });
        }
        return res.status(403).json({ message: 'Unauthorized: Invalid Token, error: error.message' });
    }
};