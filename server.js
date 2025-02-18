const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/activity-tracking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Base de données connectée'))
  .catch((err) => console.log('Erreur de connexion à MongoDB', err));

// Schéma de l'activité utilisateur
const activitySchema = new mongoose.Schema({
  page: String,
  details: Object,
  timestamp: String,
  userAgent: String,
});

const Activity = mongoose.model('Activity', activitySchema);

// API pour enregistrer l'activité de l'utilisateur
app.post('/record-activity', (req, res) => {
  const { page, details, timestamp, userAgent } = req.body;

  const newActivity = new Activity({
    page,
    details,
    timestamp,
    userAgent,
  });

  newActivity.save()
    .then(() => res.status(200).send('Activité enregistrée'))
    .catch((err) => res.status(500).send('Erreur d’enregistrement de l’activité'));
});

// Ajouter une route pour la page d'accueil
app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur Node.js pour l\'enregistrement des activités !');
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
