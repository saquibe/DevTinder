// const express = require('express');
import express from "express";

const app = express();

//this will only handle GET call request
app.get("/test", (req, res) => {
  res.send({ FirstName: "Mohammad", LastName: "Saquib" });
});

//post call sending data to database
app.post("/user", (req, res) => {
  res.send("Data saved to the database successfully!");
});

//delete call
app.delete("/user1", (req, res) => {
  res.send("User 1 is deleted successfully!");
});

//this will match all the http request
app.use("/date", (req, res) => {
  res.send("Updated content: " + new Date());
});

app.listen(3000, () => {
  console.log(`Server is listening on port 3000...`);
});
