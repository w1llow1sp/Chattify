import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(
    cors({
        origin: process.env.NODE_ENV === 'production' ? false : "http://localhost:5173",
        credentials: true,
    })
);

// Простые тестовые маршруты
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!', env: process.env.NODE_ENV });
});

app.get('/api/test/:id', (req, res) => {
    res.json({ message: 'Test route with ID', id: req.params.id });
});

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log('server listening on port: ' + PORT);
    console.log('NODE_ENV:', process.env.NODE_ENV);
})
