// Les dépendances du projet
const express = require('express'); // Express pour le serveur web
const path = require('path'); // Path pour les chemins
const cors = require('cors'); // Cors pour cors
const mysql = require('mysql'); // Mysql pour la bdd
require('dotenv').config(); // Dotenv pour le .env

const app = express(); // On crée une app express

const PORT = 8000; // Sur le port 8000

app.use(express.static(__dirname + 'WEB')); 
app.use(cors());
app.use(express.json());

// BDD
const bdd = mysql.createConnection({
  host: process.env.BDDHOST,
  user: process.env.BDDUSER,
  password: process.env.BDDPASSWORD,
  database: process.env.BDDDATABASE
}); // On initialise la connexion à la BDD

bdd.connect((err) => {
  if (err) { console.error(err); return; }
  console.log("Connecté à la BDD");
}); // On se connecte à la BDD


// Fichiers
app.get('/', (req, res) => {
  res.sendFile("index.html", {root: path.join(__dirname, "WEB")});
});
app.get('/login', (req, res) => {
  res.sendFile("login.html", {root: path.join(__dirname, "WEB")});
});
app.get('/signup', (req, res) => {
  res.sendFile("signup.html", {root: path.join(__dirname, "WEB")});
});


// Pour que le serveur puisse charger les fichiers sinon c'est kaput
app.get('/style.css', (req, res) => { res.sendFile("style.css", {root: path.join(__dirname, "WEB")}); });
app.get('/main.js', (req, res) => { res.sendFile("main.js", {root: path.join(__dirname, "WEB")}); });


//Apis
app.post('/api/signup', (req, res) => {
  bdd.query("SELECT * FROM users WHERE username = ?;", [req.body.username], (err, results) => {
    if (err) { 
      console.log(err);
      return res.status(500).json({ error: err.message })
    }

    if (results.length > 0) {
      return res.json({"message": "Username already taken"})
    }

    bdd.query("INSERT INTO users (username, hashed_password) VALUES (?, ?);", [req.body.username, req.body.password], (err, results) => {
      if (err) { 
        console.log(err);
        return res.status(500).json({ error: err.message })
      }

      return res.json({"message": "Account created"});
    })
  })

  
});

app.post('/api/login', (req, res) => {
  bdd.query("SELECT * FROM users WHERE username = ? AND hashed_password = ?;",[req.body.username, req.body.password], (err, results) =>{
    if (err){
      console.log(err);
      return res.status(500).json({ error: err.message })
    }
  })
  
});

app.post('/api/changeuser', (req, res) => {
  
});

app.post('/api/changepassword', (req, res) => {
  
});

app.post('/api/deleteaccount', (req, res) => {
  
});



// App listen
app.listen(PORT, () => {
  console.log(`Le serveur est en écoute sur le port ${PORT}`);
});

