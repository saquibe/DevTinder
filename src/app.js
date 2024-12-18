// const express = require('express');
import express from "express";

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("First response has send!");
    // res.send("First response");
    next();
  },
  (req, res, next) => {
    console.log("Second response has send!");
    // res.send("Second response");
    next();
  },
  (req, res, next) => {
    console.log("Third response has send!");
    // res.send("Third response");
    next();
  },
  (req, res, next) => {
    console.log("Fourth response has send!");
    // res.send("Fourth response");
    next();
  },
  (req, res) => {
    console.log("Fifth response has send!");
    res.send("Fifth response");
  }
);

//this will only handle GET call request
// app.get("/test/:userId/:name/:password", (req, res) => {
//   console.log(req.params);
//   res.send({ FirstName: "Mohammad", LastName: "Saquib" });
// });

//this will match all the http request
// app.use("/date", (req, res) => {
//   res.send("Updated content: " + new Date());
// });

app.listen(3000, () => {
  console.log(`Server is listening on port 3000...`);
});
