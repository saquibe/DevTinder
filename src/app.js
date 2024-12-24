// const express = require('express');
import express from "express";
import connectDb from "./config/database.js";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import requestRouter from './routes/request.js';

dotenv.config();

const app = express();

//middleware
app.use(express.json());  
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

connectDb().then(()=> {
  console.log('mongodb connected successfully!');
  app.listen(3000, () => {
    console.log(`Server is listening on port 3000...`);
  });
}).catch((err) => {
  console.error('Database can not be connect!', err);
})

