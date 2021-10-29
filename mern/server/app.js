const express = require('express');

require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => res.status(200).send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${ port }!`));
