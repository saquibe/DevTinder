// const express = require('express');
import express from "express";
import connectDb from "./config/database.js";
import User from "./models/user.js";

const app = express();

app.post('/signup', async  (req, res) => {
  //creating the new instance of the user model
  const user = new User({
    firstName: 'Mohammad',
    lastName: 'Asif',
    emailId: 'asif@gmail.com',
    password: 'asif@123',
    age: 75,
    gender: 'M'
  })
  try {
    await user.save();
    res.send('User added successfully!');
  } catch (err) {
    res.status(400).send('Error saving the user!', err.message);
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

