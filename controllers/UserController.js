import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try {
        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email already exists',
            });
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to register' });
    }
};


export const login = async (req, res) => {
    try {
        console.log('➡️ Запит на логін отримано');

        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            console.log('❌ Користувача не знайдено');
            return res.status(404).json({ message: 'User not found' });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        console.log('✅ Перевірка пароля:', isValidPass);

        if (!isValidPass) {
            console.log('❌ Невірний пароль');
            return res.status(400).json({ message: 'Password not valid' });
        }

        let token;
        try {
            token = jwt.sign(
                { _id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );
        } catch (tokenErr) {
            console.log('❌ Помилка генерації токена:', tokenErr);
            return res.status(500).json({ message: 'Token generation failed' });
        }

        const { passwordHash, ...userData } = user._doc;
        console.log('✅ Успішна авторизація, відправка відповіді');

        res.json({
            ...userData,
            token,
        });

    } catch (err) {
        console.error('❌ Помилка login:', err);
        res.status(500).json({ message: 'Failed to login' });
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