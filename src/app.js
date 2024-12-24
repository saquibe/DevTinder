// const express = require('express');
import express from "express";
import connectDb from "./config/database.js";
import User from "./models/user.js";
import { validateSignUpData } from "./utils/validation.js";
import bcryptjs from 'bcryptjs';
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userAuth } from "./middlewares/auth.js";

dotenv.config();

const app = express();

//middleware
app.use(express.json());  
app.use(cookieParser());

//signup api
app.post('/signup', async  (req, res) => {
  try {
  //validate data
  validateSignUpData(req);
  
  //encrypt the password
  const {firstName, lastName, emailId, password, gender} = req.body;
  const hashPassword = await bcryptjs.hash(password, 10)
    
  // creating the new instance of the user model
  const user = new User({
    firstName, lastName, emailId, gender, password: hashPassword
  })
    await user.save();
    res.send('User added successfully!');
  } catch (err) {
    res.status(400).send('Error: '+ err.message);
  }
})

//login api
app.post('/login', async (req, res) => {
  try {
    const {emailId, password} = req.body;
    const user = await User.findOne({emailId: emailId});
    if(!user){
      throw new Error('Invalid credientials!');
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if(isPasswordValid){
      //create jwt token
      const token = await jwt.sign({_id: user._id},  process.env.JWT_SECRET, {expiresIn: "1d"});
      //add the token to cookie and send the response back to the user
      res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});
      res.send('Login successfully!');
    }else{
      throw new Error('Invalid credientials!');
    }
  } catch (err) {
    res.status(400).send('Error: '+ err.message);
  }
})

//profile api
app.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send('Error: ', err.message);
  }
})

//sending connection request api
app.post('/connection', userAuth, async (req, res) => {
  const user = req.user;
  console.log('Sending connection request!');
  res.send(user.lastName+' send the connection request');
})

connectDb().then(()=> {
  console.log('mongodb connected successfully!');
  app.listen(3000, () => {
    console.log(`Server is listening on port 3000...`);
  });
}).catch((err) => {
  console.error('Database can not be connect!', err);
})

