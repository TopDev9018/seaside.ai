const express = require('express');
const dotenv = require('dotenv');
const { connectDb } = require("./src/config/database")
const bodyParser = require('body-parser')
const cors = require('cors')

dotenv.config();

//Importing the auth routes module
const auth = require("./src/routes/auth.routes");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000;

connectDb();

app.use("/api/auth", auth)

app.get('/', (req, res) => {
    res.send('Welcome to Nodejs Authentication Tutorial')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});