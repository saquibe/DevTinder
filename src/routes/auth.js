import express from 'express';
import User from '../models/user.js';
import { validateSignUpData } from '../utils/validation.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
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
});

authRouter.post('/login', async (req, res) => {
  try {
    const {emailId, password} = req.body;
    const user = await User.findOne({emailId: emailId});
    if(!user){
      throw new Error('Invalid credientials!');
    }
    const isPasswordValid = await user.validatePassword(password);
    if(isPasswordValid){
      const token = await user.getJWT();
      res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});
      res.send('Login successfully!');
    }else{
      throw new Error('Invalid credientials!');
    }
  } catch (err) {
    res.status(400).send('Error: '+ err.message);
  }
})

authRouter.post('/logout', (req, res) => {
  // res.clearCookie('token');
  // res.send('Logout successfully!');
  //OR
  res.cookie('token', 'null', {expires: new Date(Date.now())});
  res.send('Logout successfully!');
})

export default authRouter;