// const express = require('express');
import express from "express";

const app = express();

//this will only handle GET call request
app.get("/test/:userId/:name/:password", (req, res) => {
  console.log(req.params);
  res.send({ FirstName: "Mohammad", LastName: "Saquib" });
});

//this will match all the http request
// app.use("/date", (req, res) => {
//   res.send("Updated content: " + new Date());
// });

app.listen(3000, () => {
  console.log(`Server is listening on port 3000...`);
});
