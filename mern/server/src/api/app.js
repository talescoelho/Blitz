const express = require('express');
const users = require('./routes/users');
const tasks = require('./routes/tasks');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.status(200).send('Hello World!'));

app.use('/', users);
app.use('/', tasks);

app.listen(port, () => console.log(`Example app listening on port ${ port }!`));

module.exports = app;
