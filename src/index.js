import express from "express"
import path from "path";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import {connectDB} from "./lib/db.js"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cors from "cors"
import { app, server } from "./lib/socket.js";
import mongoose from 'mongoose'
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(cookieParser())


const allowedOrigins = [
  "http://localhost:5173",
  "https://chatty-app-delta.vercel.app",
  "https://chatty-pfo0snnzv-s-s-hariharans-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

dotenv.config()
const PORT = process.env.PORT
const __dirname = path.resolve();

app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)

app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'UP' : 'DOWN';
    const status = dbStatus === 'UP' ? 200 : 503;
    res.status(status).json({
        status: dbStatus === 'UP' ? 'healthy' : 'unhealthy',
        database: dbStatus,
        uptime: process.uptime(),
        timestamp: new Date()
    });
});

server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);   
    connectDB()
})

