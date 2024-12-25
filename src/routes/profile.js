import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { validateEditProfileData } from '../utils/validation.js';

const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
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
  
  res.send(`${loggedInUser.firstName} your profile updated successfully!`)
  await loggedInUser.save();
}catch (err) {
 res.status(400).send('Error: '+ err.message);
}})

export default profileRouter;