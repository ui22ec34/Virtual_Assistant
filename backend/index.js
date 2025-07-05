import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import si from 'systeminformation';
import multer from 'multer';

import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import systemRouter from './routes/system.routes.js';



const app = express();

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/system", systemRouter);



app.post("/api/gemini", async (req, res) => {
  try {
    const { command } = req.body;
    console.log("Incoming command:", command); // ✅ Debug
    const result = await geminiResponse(command);
    console.log("Gemini result:", result); // ✅ Debug
    res.json(result);
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
});


// ✅ System Info
app.get("/api/system", async (req, res) => {
  try {
    const cpu = await si.cpu();
    const mem = await si.mem();
    const osInfo = await si.osInfo();
    const gpu = await si.graphics();
    res.json({ cpu, mem, osInfo, gpu });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start Server
const PORT = 8000;
app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
