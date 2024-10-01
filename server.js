// import our dependencies
const express = require("express");
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');

// configure environment variables
dotenv.config();

// create a connection object
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test the connection
db.connect((err) => {
  // if the connection is not successful
  if (err) {
    return console.log("Error connecting to the database: ", err);
  }

  // connection is successful
  console.log("Successfully connected to MySQL: ", db.threadId);
});

// retrive all patients
app.get('', (req, res) => {
    const getPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients"
    db.query(getPatients, (err, data) => {
      if(err) {
        return res.status(400).send("Failed to get patients", err)
      }

      res.status(200).send(data)

    })

})

// retrive all provider
app.get('/providers', (req, res) => {
  const getProviders = "SELECT first_name, last_name, provider_specialty FROM providers";
  db.query(getProviders, (err, result) => {
    if(err) {
      return res.status(400).send("Failed to get providers", err)
    }

    res.status(200).send(result);

  })

})

// filter patients by first_name
app.get('', (req, res) => {
  const first_name = req.quert.first_name
  const getPatients = "SELECT first_name  FROM patients WHERE first_name = ?";
  
  db.query(getPatients, first_name, (err, output) => {
    if(err) {
      return res.status(400).send("Failed to get patients_firstName", err)
    }
    if (output.length === 0) {
      return res.status(404).send("No patients found with this first_name")
    }

    res.status(200).send(output)

  })

})

// Retrieve all providers by their specialty
app.get('/providers', (req, res) => {
  const providerSpecialty = req.query.provider_specialty;
  const getProviders = "SELECT * FROM providers WHERE provider_specialty = ?";

  db.query(getProviders, providerSpecialty, (err, data) => {
    if (err) {
      return res.status(500).send({ message: "Failed to get providers", error: err });
    }

    if (data.length === 0) {
      return res.status(404).send({ message: "No providers found with this specialty" });
    }

    res.status(200).send(data);
  });
});



// start and listen to the server
app.listen(3300, () => {
  console.log('Server is running on port 3300...');
});