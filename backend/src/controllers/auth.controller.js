import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import e from "express";
import {generateToken} from "../lib/utils.js";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        // hash password
        if(!fullName || !email || !password) {
            return res
                .status(400)
                .json({message: 'Все поля обязательны'})
        }
        if (password.length < 6) {
            return res
                .status(400)
                .json({message: 'Пароль должен быть более 6 символов'})
        }
        const user = await User.findOne({email})
        if (user) {
            return res
                .status(400)
                .json({message: 'Пользователь с таким email уже существует'})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
        if (newUser) {
            // генерируем jwt-токен
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201)
                .json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic,
                })
        } else {
            res
                .status(400)
                .json({message: 'Некорректные данные пользователя'})
        }

    } catch (error) {
        console.error('Error to sign up controller', error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const login = (req, res) => {
    res.send('login route');
}

export const logout = (req, res) => {
    res.send('logout route');
}