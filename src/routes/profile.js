import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { validateEditProfileData } from '../utils/validation.js';

const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({message: 'Profile fetched successfully!', data: user});
  } catch (err) {
    res.status(400).json({message: 'Error: '+ err.message});
  }
})

profileRouter.post('/profile/edit', userAuth, async (req, res) => {
  try {
  if(!validateEditProfileData(req)){
    throw new Error('Invalid edit request!'); 
  }
  const loggedInUser = req.user;
  
  Object.keys(req.body).forEach((field) => {
    loggedInUser[field] = req.body[field];
  })
  
  await loggedInUser.save();

   res.status(200).json({
     success: true,
     message: `${loggedInUser.firstName}, your profile has been updated successfully!`,
     data: loggedInUser,
   });
}catch (err) {
 res.status(400).json({message: 'Error: '+ err.message});
}})

export default profileRouter;