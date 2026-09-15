// Fonction loginBDD(serveur, user, password, bdd)
//              serveur : ip du serveur qui héberge la bdd
//              user : utilisateur qui a accès à la bdd
//              password : mot de passe de cet utilisateur
//              bdd : nom de la bdd
// La valeur de retour est TRUE si la connexion s'est effectué, sinon renvoyer le message d'erreur

const express = require('express');
const path = require('path');
const app = express();
const port = 8000; // Le port sur lequel votre serveur écoutera

// Route d'exemple
app.get('/', (req, res) => {
  res.sendFile("index.html", {root: path.join(__dirname, "WEB")});
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});


