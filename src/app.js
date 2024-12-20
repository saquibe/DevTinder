// const express = require('express');
import express from "express";

const app = express();

app.get("/userData", (req, res) => {
  throw new Error("thorw new error");
  res.send("User data response send");
});

//error handling
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Internal server error");
  }
});

app.listen(3000, () => {
  console.log(`Server is listening on port 3000...`);
});
