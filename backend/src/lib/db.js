import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
       const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to DB : ${connection.connection.host}`);
    }catch (e) {
        console.log('MongoDB error:',e);

    }
}