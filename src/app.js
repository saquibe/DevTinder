// const express = require('express');
import express from "express";
import connectDb from "./config/database.js";
import User from "./models/user.js";

const app = express();

//middleware
app.use(express.json());

//signup api
app.post('/signup', async  (req, res) => {
  // console.log(req.body);
  
  // creating the new instance of the user model
  const user = new User(req.body)
  try {
    await user.save();
    res.send('User added successfully!');
  } catch (err) {
    res.status(400).send('Error saving the user!' );
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
    res.status(400).send('Something went wrong!', err.message);
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

