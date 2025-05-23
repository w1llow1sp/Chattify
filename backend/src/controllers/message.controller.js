import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const filtredUsers = await User.find({
            _id: {$ne: loggedUserId}
        }).select('-password');

        res.status(200).json(filtredUsers);
    } catch (error) {
        console.error('Error in getUsersForSidebar', error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id: userToChatId} = req.user;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error in getMessages', error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save();
        // TODO: realtime functionality goes here  => soket.io

        res.status(200).json(newMessage);
    } catch (error) {
        console.error('Error in sendMessage', error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}