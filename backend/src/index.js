import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from './routes/message.route.js'
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config()

const app = express();
const PORT = process.env.PORT;

//app.use(express.json())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cookieParser())
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);


app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes);



app.listen(PORT, () => {
    console.log('server listening on port PORT: ' + PORT);
    connectDB()
})
