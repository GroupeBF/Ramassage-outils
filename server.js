const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: multer.memoryStorage() })
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.none());

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
    pass: process.env.EMAIL_PASS,
  }
});


// API pour envoyer un e-mail
app.post('/send-email', upload.single('photo'), async (req, res) => {
    try {
        console.log("Données reçues :", req.body);
        console.log("Fichier reçu :", req.file);

        if (!req.body.subject || !req.body.text) {
            return res.status(400).json({ error: 'Sujet et contenu requis' });
        }

        // 📌 Configuration de l'email
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Remplace par ton email
                pass: process.env.EMAIL_PASS // Remplace par ton mot de passe (ou utilise un token d'application)
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'lboudon@groupebf.fr', // Remplace par le bon destinataire
            subject: req.body.subject,
            text: req.body.text,
            attachments: req.file ? [{ 
                filename: req.file.originalname, 
                content: req.file.buffer 
            }] : []
        };

        // 📌 Envoi de l'email
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Email envoyé !" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});
// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`);
});
