require("dotenv").config(); // intitializing env file
const express = require("express");
const app = express();

require("./startup/index.startup")(app); // strating server
