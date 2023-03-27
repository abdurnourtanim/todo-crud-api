const express = require("express");
const connect = require("./database/connect");
const todoHandle = require("./controller/todoHandle");
const userHandle = require("./controller/userHandle");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

app.use(express.json());

// database connection
connect();

// todo route
app.use("/todo", todoHandle);
//user route
app.use("/user", userHandle);

app.listen(4000, () => console.log("Server runing on PORT:4000"));
