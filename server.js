// Les dépendances du projet
const express = require('express'); // Express pour le serveur web
const path = require('path'); // Path pour les chemins
const cors = require('cors'); // Cors pour cors
const mysql = require('mysql'); // Mysql pour la bdd
const bcrypt = require('bcrypt'); // Bcrypt pour le hashage des mots de passe
const jwt = require('jsonwebtoken'); // JWT pour les tokens
require('dotenv').config(); // Dotenv pour le .env

const app = express(); // On crée une app express

const PORT = 8000; // Sur le port 8000

const USERNAME_PATTERN = /^.{4,16}$/;
const PASSWORD_PATTERN = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W]).{8,64})$/;

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

function verifierToken(req, res, next) {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide ou expiré" });
    }
    req.user = user; // contient { id, username }
    next();
  });
}

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

    bcrypt.hash(req.body.password, 10, (err, hashed_password) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message })
      }

      bdd.query("INSERT INTO users (username, hashed_password) VALUES (?, ?);", [req.body.username, hashed_password], (err, results) => {
        if (err) { 
          console.log(err);
          return res.status(500).json({ error: err.message })
      }

      return res.json({"message": "Account created"});
    })
  })
  })

  
});

app.post('/api/login', (req, res) => {
  bdd.query(
  "SELECT * FROM users WHERE username = ?;", [req.body.username], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
      error: err.message
      });
      }

  if (results.length === 0) {
    return res.status(401).json({
    error: "Utilisateur introuvable"
    });
  }
  bcrypt.compare(
  req.body.password,
  results[0].hashed_password,
  (err, isMatch) => {

  if (err) {
   console.log(err);
    return res.status(500).json({
      error: err.message
      });
  }
  if (!isMatch) {
    return res.status(401).json({
     error: "Mot de passe incorrect"
      });
 }
      const token = jwt.sign(
        { id: results[0].id, username: results[0].username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({ message: "Connexion réussie", token: token });
    });
  });
});

app.get('/api/me', verifierToken, (req, res) => {
  res.json({ username: req.user.username });
});

// Changer le nom d'utilisateur
app.post('/api/changeuser', verifierToken, (req, res) => {
  const newUsername = req.body.newUsername;

  if (!USERNAME_PATTERN.test(newUsername)) {
    return res.status(400).json({ error: "Username invalide" });
  }

  // Est-ce que le nom est déjà pris ?
  bdd.query("SELECT id FROM users WHERE username = ?;", [newUsername], (err, results) => {
    if (err) { console.log(err); return res.status(500).json({ error: err.message }); }

    if (results.length > 0) {
      return res.status(400).json({ error: "Username déjà pris" });
    }

    bdd.query("UPDATE users SET username = ? WHERE id = ?;", [newUsername, req.user.id], (err) => {
      if (err) { console.log(err); return res.status(500).json({ error: err.message }); }

      // Le nom est dans le token, donc on en recrée un nouveau
      const token = jwt.sign(
        { id: req.user.id, username: newUsername },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return res.json({ message: "Username modifié", token: token });
    });
  });
});

// Changer le mot de passe
app.post('/api/changepassword', verifierToken, (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!PASSWORD_PATTERN.test(newPassword)) {
    return res.status(400).json({ error: "Nouveau mot de passe invalide" });
  }

  bdd.query("SELECT hashed_password FROM users WHERE id = ?;", [req.user.id], (err, results) => {
    if (err) { console.log(err); return res.status(500).json({ error: err.message }); }

    // On vérifie l'ancien mot de passe
    bcrypt.compare(oldPassword, results[0].hashed_password, (err, isMatch) => {
      if (err) { console.log(err); return res.status(500).json({ error: err.message }); }

      if (!isMatch) {
        return res.status(401).json({ error: "Ancien mot de passe incorrect" });
      }

      bcrypt.hash(newPassword, 10, (err, hashed) => {
        if (err) { console.log(err); return res.status(500).json({ error: err.message }); }

        bdd.query("UPDATE users SET hashed_password = ? WHERE id = ?;", [hashed, req.user.id], (err) => {
          if (err) { console.log(err); return res.status(500).json({ error: err.message }); }
          return res.json({ message: "Mot de passe modifié" });
        });
      });
    });
  });
});

// Supprimer le compte
app.post('/api/deleteaccount', verifierToken, (req, res) => {
  bdd.query("DELETE FROM users WHERE id = ?;", [req.user.id], (err) => {
    if (err) { console.log(err); return res.status(500).json({ error: err.message }); }
    return res.json({ message: "Compte supprimé" });
  });
});



// App listen
app.listen(PORT, () => {
  console.log(`Le serveur est en écoute sur le port ${PORT}`);
});

