const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connexion MongoDB (Railway)
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Base de données connectée'))
  .catch((err) => console.log('❌ Erreur de connexion à MongoDB', err));

// Schéma de l'activité utilisateur
const activitySchema = new mongoose.Schema({
  Action: String,
  Entreprise: String,
  Utilisateur: String,
  Heure: String
});

const Activity = mongoose.model('Activity', activitySchema);

// API pour enregistrer l'activité utilisateur
app.post('/record-activity', (req, res) => {
  console.log("📩 Requête reçue : ", req.body);

  const { Action, Entreprise, Utilisateur, Heure } = req.body;
  const newActivity = new Activity({ Action, Entreprise, Utilisateur, Heure });

  newActivity.save()
    .then(() => {
      console.log("✅ Activité enregistrée !");
      res.status(200).send('Activité enregistrée');
    })
    .catch((err) => {
      console.error("❌ Erreur d’enregistrement :", err);
      res.status(500).send('Erreur d’enregistrement de l’activité');
    });
});

// Configuration du transporteur Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// API pour envoyer un e-mail
app.post('/send-email', async (req, res) => {
  const { subject, text } = req.body;

  if (!subject || !text) {
    return res.status(400).json({ error: 'Sujet et contenu requis' });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'lboudon@groupebf.fr',
      subject,
      text
    });
    console.log("✅ E-mail envoyé !");
    res.status(200).json({ message: 'E-mail envoyé avec succès' });
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'e-mail:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'e-mail' });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`);
});
