import User from '../models/auth.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'
import { existsSync } from 'fs';

const register = async (req, res) => {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({user:{ name: user.name },token});
}

const login = async(req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({ email })
    if(!user) {
        throw new UnauthenticatedError('Invalid credentials. Please provide a valid email')
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials. Please provide correct password')
    }
    const token = user.createJWT();
    res.json({ user:{ name: user.name }, token })
}

export {register, login};