// const express = require('express');
import express from "express";

const app = express();

app.use("/user", (req, res, next) => {
  console.log("First response has send!");
  // res.send("First response");
  next();
});

app.use("/user", (req, res, next) => {
  console.log("Second response has send!");
  res.send("Second response");
  next();
});

app.listen(3000, () => {
  console.log(`Server is listening on port 3000...`);
});
