// const express = require('express');
import express from "express";
import connectDb from "./config/database.js";
import User from "./models/user.js";
import { validateSignUpData } from "./utils/validation.js";
import bcryptjs from 'bcryptjs';
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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
      const token = await jwt.sign({_id: user._id},  process.env.JWT_SECRET);
      //add the token to cookie and send the response back to the user
      res.cookie("token", token);
      res.send('Login successfully!');
    }else{
      throw new Error('Invalid credientials!');
    }
  } catch (err) {
    res.status(400).send('Error: '+ err.message);
  }
})

//profile api
app.get('/profile', async (req, res) => {
  try {
    const userCookie = req.cookies;
    const {token} = userCookie;
    if(!token){
      throw new Error('Invalid token!');
    }
    //validate token
    const decodeMessage = await jwt.verify(token, process.env.JWT_SECRET);
    const {_id} = decodeMessage;
    //get back profile of user when loggedIn
    const user = await User.findById(_id);
    if(!user){
      throw new Error('User does not exist!');
    }
    res.send(user);
  } catch (err) {
    res.status(400).send('Error: ', err.message);
  }
})

//find user specific user
// Get user by last name
app.get('/specific', async (req, res) => {
  const userLastName = req.query.lastName; // Use req.query for query parameters in GET requests
  console.log('LastName:', userLastName); // Debugging

  try {
    if (!userLastName) {
      return res.status(400).send('LastName is required');
    }

    const user = await User.findOne({ lastName: userLastName });
    if (!user) {
      return res.status(404).send('User not found!');
    }

    res.send(user);
  } catch (err) {
    console.error('Error:', err.message); // Log the error
    res.status(500).send('Something went wrong');
  }
});



//feed api: get all user from database
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send('Error: ', err.message);
  }
})


//delete user
app.delete('/user', async (req, res) => {
  const userId = req.body._id; 
  try {
    const user = await User.findByIdAndDelete({_id: userId});
    res.send('User deleted successfully!');
  } catch (err) {
    res.status(400).send('Something went wrong!');
  }
})

//update data
app.patch('/user', async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, data, { new: true });
    res.send('User updated successfully!');
  } catch (err) {
    res.status(400).send('something went wrong');
  }
})

connectDb().then(()=> {
  console.log('mongodb connected successfully!');
  app.listen(3000, () => {
    console.log(`Server is listening on port 3000...`);
  });
}).catch((err) => {
  console.error('Database can not be connect!', err);
})

