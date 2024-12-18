// const express = require('express');
import express from "express";

const app = express();

let port = 3000;

//request handler
app.use("/test", (req, res) => {
  res.send("Hello response from the server!");
});

app.use("/", (req, res) => {
  res.send("Updated content: " + new Date());
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
