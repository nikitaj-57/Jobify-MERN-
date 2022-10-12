// In order to authorize the user for access
import User from '../models/auth.js';
import jwt from 'jsonwebtoken';
import {UnauthenticatedError} from '../errors/index.js';

// const auth = async(req, res, next) => {
//     // console.log(req.headers.authorization);
//     const authHeader = req.headers.authorization

//     if(!authHeader || !authHeader.startsWith('Bearer')) {
//         throw new UnauthenticatedError('No token provided');
//     }
//     // To get the token only
//     const token = authHeader.split(' ')[1]

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         // console.log(decoded);
//         // { id: 2, username: 'Nikita', iat: 1664682923, exp: 1667274923 }
//         const {id, username} = decoded
//         req.user = {id, username}
//         next()
//     } catch (error) {
//         throw new UnauthenticatedError('Not authorized to access this route');
//     }
// }

const auth = async(req, res, next) => {
    // check for header and check if it exists or start with bearer
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication Invalid');
    }
    // Split the Header to get only the token without Bearer
    const token = authHeader.split(' ')[1];
    // 
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // attach the user to job routes
        req.user = {userId: payload.userId, name: payload.name}
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid');
    }
}

export default auth;