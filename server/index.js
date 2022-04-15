require("./config/db");

const express = require("express");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(3000, () => {
    console.log("Server Runnig on port 3000")
})