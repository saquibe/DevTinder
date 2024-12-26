import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import ConnectionRequestModel from '../models/connectionRequest.js';
import User from '../models/user.js';

const userRouter = express.Router();

//get all the pending connection requests for the logged in user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({  toUserId: loggedInUser._id, status: 'interested' }).populate('fromUserId', ['firstName', 'lastName', 'avatar', 'age', 'gender', 'skills', 'description']);  
    res.json({message: 'Received connection requests fetched successfully!', data: connectionRequests});
  } catch (error) {
    res.statusCode(400).send('Error: '+ error.message);
  }
})

//get all connections of the logged in user
userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({ $or: [{ fromUserId: loggedInUser._id, status: 'accepted' }, { toUserId: loggedInUser._id, status: 'accepted' }]}).populate('fromUserId', ['firstName', 'lastName', 'avatar', 'age', 'gender', 'skills', 'description']).populate('toUserId', ['firstName', 'lastName', 'avatar', 'age', 'gener', 'skills', 'description']);

    const data = connectionRequests.map((row) => {
      if(row.fromUserId._id.equals(loggedInUser._id)){
        return row.toUserId;
      }else{
        return row.fromUserId
    }});

    res.json({message: 'Connections fetched successfully!', data});
  } catch (err) {
    res.statusCode(400).send('Error: '+ err.message);
  }
})

//feed
userRouter.get('/user/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    //get all the connection requests (sent+received) for the logged in user
    const connectionRequests = await ConnectionRequestModel.find({ $or: [{ fromUserId: loggedInUser._id}, { toUserId: loggedInUser._id}]}).select('fromUserId toUserId status').populate('fromUserId', ['firstName', 'lastName']).populate('toUserId', ['firstName', 'lastName']);

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId._id.toString());
      hideUsersFromFeed.add(request.toUserId._id.toString());
    })
  
    const users = await User.find({$and: [{_id: {$nin: Array.from(hideUsersFromFeed)}}, {_id: {$ne: loggedInUser._id}}]}).select('firstName lastName age description avatar skills gender');
    
    res.json({message: 'Feed fetched successfully!', data: users});

  } catch (err) {
    res.statusCode(400).send('Error: '+ err.message);
  }
})

export default userRouter;