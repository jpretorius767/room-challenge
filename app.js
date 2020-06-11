'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const roomRoutes = require('./routes/rooms');
const userRoutes = require('./routes/users');

const PORT = 1556;

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());

// Add routes
app.use('/room', roomRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => 
 console.log(`App listening at http://localhost:${PORT}`)
)

module.exports = app;