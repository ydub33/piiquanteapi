const path = require('path');
const express = require('express');
const mongoose = require('mongoose')
const cors = require("cors");
const helmet = require('helmet');

require('dotenv').config()
const app = express();

app.use(express.json());
app.use(helmet({
    crossOriginResourcePolicy: false,
  }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

/* routes */
const users = require('./routes/users')
const sauces = require('./routes/sauces')

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

/* execute routes */
app.use('/api/auth',users)
app.use('/api/sauces',sauces)
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;


