const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(express.static(__dirname + 'WEB'));
app.use(cors());


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


//Api
app.post('/api/signup', (req, res) => {
  
});

app.post('/api/login', (req, res) => {
  
})

app.post('/api/changeuser', (req, res) => {
  
})

app.post('/api/changepassword', (req, res) => {
  
})

app.post('/api/deleteaccount', (req, res) => {
  
})



// App listen
app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});

