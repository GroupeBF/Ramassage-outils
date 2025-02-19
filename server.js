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
  .catch((err) => console.log('Erreur de connexion à MongoDB', err));

// Schéma de l'activité utilisateur
const activitySchema = new mongoose.Schema({
  Entreprise: String,
  Utilisateur: String,
  Heure: String,

});

const Activity = mongoose.model('Activity', activitySchema);

// API pour enregistrer l'activité de l'utilisateur
app.post('/record-activity', (req, res) => {

  console.log("Requête reçue : ", req.body);
  
  const { Entreprise, Utilisateur, Heure} = req.body;

  const newActivity = new Activity({
    Entreprise,
    Utilisateur,
    Heure,
     });

  Activity.find().sort({ Heure: -1 }).exec((err, activities) => {
    if (err) {
        console.error('Erreur lors de la récupération des données:', err);
    } else {
        console.log('Activités récupérées :', activities);
    }
});
  
  newActivity.save()
    .then(() => {
            console.log("Activité enregistrée !");
            res.status(200).send('Activité enregistrée');
        })
    .catch((err) => {
            console.error("Erreur d’enregistrement :", err);
            res.status(500).send('Erreur d’enregistrement de l’activité');
        });
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
