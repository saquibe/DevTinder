import express from 'express';
import { userAuth } from '../middlewares/auth.js';


const requestRouter = express.Router();

requestRouter.post("/connection", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.lastName + " send the connection request");
});

export default requestRouter;