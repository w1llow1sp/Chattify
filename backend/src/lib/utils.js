import jwt from "jsonwebtoken";

export const generateToken = (userID, res) => {
    const token = jwt.sign(
        {userID},
        process.env.JWT_SECRET,
        {expiresIn: '7d'})

    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // ms
        httpOnly: true, // от xss атак
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
    })

    return token;
}