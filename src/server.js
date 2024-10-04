require("dotenv").config();
const express = require("express");
const app = express();
const http = require('http');

require("./startup/index.startup")(app);

const keepServerAlive = () => {
  setInterval(() => {
    http.get(process.env.SERVER_URL, (res) => {
      console.log(`Pinged server with status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`Failed to ping server: ${err.message}`);
    });
  }, 5 * 60 * 1000);
};

const startServer = (port) => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use. Trying port ${port + 1}...`);
      startServer(port + 1); // Try the next port
    } else {
      console.error('Error starting server:', err);
    }
  });
};

const PORT = process.env.PORT || 8001; // Start from the defined port
keepServerAlive();
startServer(PORT);
