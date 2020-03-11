'use strict';

const serverless = require("serverless-http");
const express = require("express");
const app = express();
app.use(express.json());
const uuidv4 = require("uuid/v4");
const mysql = require("mysql");
const cors = require("cors");
app.use(cors());

// CONFIG for connecting to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA
});

// GET  / RETRIEVING the challenges
app.get("/challenge", function(req, res) {
  connection.query('SELECT * FROM `challenge` WHERE `userId` = "1"', function(
    error,
    results,
    fields
  ) {
    // error will be an Error if one occurred during the query
    if (error) {
      console.error("Your query had a problem with fetching challenges", error);
      res.status(500).json({ errorMessage: error });
    } else {
      // query was successful
      res.json({ challenge: results });
    }
  });
});

// PUT / UPDATING - marking challenge - I did it!
app.put("/challenge/:challengeId", function(req, res) {

  const challengeToUpdate = req.params.challengeId;

  connection.query("UPDATE `challenge` SET `completed` = true WHERE `challengeId` = ?", challengeToUpdate, function(
    error,
    results,
    fields
  ) {
    if (error) {
      console.error(
        "Your query had a problem with marking a challenge as completed",
        error
      );
      res.status(500).json({ errorMessage: error });
    } else {
      res.json({
        message: "Your challenge has been marked as completed",
        challenge: challengeToUpdate
      });
    }
  });
});

// PATCH / UPDATING - marking challenge - accepted
app.patch("/challenge/:challengeId", function(req, res) {

  const challengeToUpdateAccepted = req.params.challengeId;

  connection.query("UPDATE `challenge` SET `accepted` = true WHERE `challengeId` = ?", challengeToUpdateAccepted, function(
    error,
    results,
    fields
  ) {
    if (error) {
      console.error(
        "Your query had a problem with marking a challenge as accepted",
        error
      );
      res.status(500).json({ errorMessage: error });
    } else {
      res.json({
        message: "Your challenge has been marked as accepted",
        challenge: challengeToUpdateAccepted
      });
    }
  });
});

// POST / CREATING challenges - internal use only i.e. we can add challenges to database using this in Postman, but we aren't giving this option to users of the App
app.post("/challenge", function(req, res) {
  const challengeToInsert = req.body;
  challengeToInsert.challengeId = uuidv4();

  connection.query("INSERT INTO `challenge` SET ?", challengeToInsert, function(
    error,
    results,
    fields
  ) {
    if (error) {
      console.error(
        "Your query had a problem with inserting a new challenge",
        error
      );
      res.status(500).json({ errorMessage: error });
    } else {
      res.json({
        challenge: challengeToInsert
      });
    }
  });
});

// DELETE challenge either when completed or when user clicks on 'choose another'
app.delete("/challenge/:challengeId", function(req, res) {

  const challengeId = req.params.challengeId;

  connection.query("DELETE FROM `challenge` WHERE `challengeId` = ?", challengeId, function(
    error,
    results,
    fields
  ) {
    if (error) {
      console.error(
        "Your query had a problem with deleting the challenge",
        error
      );
      res.status(500).json({ errorMessage: error });
    } else {
      
      res.json({
        message : "Challenge deleted",
        challenge : results
      });
    }
  });

});




module.exports.challenge = serverless(app);