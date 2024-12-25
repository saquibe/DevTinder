import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import ConnectionRequestModel from '../models/connectionRequest.js';
import User from '../models/user.js';


const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({message: "Invalid status " + status});
    }

    const existingConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).json({message: "Request already sent!"});
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({message: "User not found!"});
    }

    const connectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.json({
      message: "Request sent successfully!",
      data,
    });
  } catch (error) {
    res.status(400).send('Error: '+ error.message);
  }
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({message: "Invalid status " + status});
    }

    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    })

    if (!connectionRequest) {
      return res.status(400).json({message: "Connection request not found!"});
    }

    connectionRequest.status = status;

    await connectionRequest.save();

    res.json({
      message: "Request reviewed successfully! " + status,
      data: connectionRequest,
    });

  } catch (error) {
    res.status(400).send('Error: '+ error.message);
  }
})

export default requestRouter;