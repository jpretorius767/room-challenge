'use strict';

const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config()

const routes = require('./routes');
// const userRoutes = require('./routes/users');

const PORT = process.env.PORT || 1556;

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());

// Add routes
app.use('/api', routes);
// app.use('/api/users', userRoutes);

// 404
app.use('*', (req, res) => res.status(404).json({ error: 'Page not found' }))

app.listen(PORT, () => 
 console.log(`App listening at http://localhost:${PORT}`)
)

module.exports = app;