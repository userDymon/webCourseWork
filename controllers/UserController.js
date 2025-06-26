import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try{
        
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            avatarUrl: req.body.avatarUrl,
            passwordHash : hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30d',
            },
        );
        
        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to register',
        });
    }
};

export const login = async (req, res) => {
    try {
        console.log('Start login process');
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        console.log('Password check:', isValidPass);

        if (!isValidPass) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        let token;
        try {
            token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        } catch (signErr) {
            console.error('JWT error:', signErr);
            return res.status(500).json({ message: 'Token error' });
        }

        const { passwordHash, ...userData } = user._doc;
        res.json({ ...userData, token });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Login failed' });
    }
};


export const getMe = async (req, res) => {
    try{
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }
         
        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get user',
        });
    }
};