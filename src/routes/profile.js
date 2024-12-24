import express from 'express';
import { userAuth } from '../middlewares/auth.js';

const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send('Error: ', err.message);
  }
})

export default profileRouter;