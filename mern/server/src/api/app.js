/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const users = require('./routes/users');
const tasks = require('./routes/tasks');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.status(200).send('Hello World!'));

app.use('/', users);
app.use('/', tasks);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
