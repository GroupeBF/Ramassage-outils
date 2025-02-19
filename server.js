const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Récupérer l'URL de MongoDB depuis les variables d'environnement
const mongoURI = process.env.MONGODB_URI;  // Utilise la variable d'environnement sur Railway

// Connexion à MongoDB via Railway
mongoose.connect(mongoURI)
  .then(() => console.log('Base de données connectée'))
  .catch((err) => console.log('Erreur de co
