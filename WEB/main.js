/* INSCRIPTION
- Récuperer la valeur du nom d'utilisateur, du mot de passe et de la confirmation du mot de passe
- Vérifier dans l'ordre :
    -> Si les mots de passe correspondent
    -> Si le mot de passe est correct, regex : /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W]).{8,64})/
    -> Si le nom d'utilisateur est correct, regex : /.{4,16}/
- Fetch l'api

Si il y a une erreur, l'afficher dans la console ET l'afficher sur l'écran de l'utilisateur

Format des variables :
    - Constante : VARIABLE_VARIABLE
    - Variable : variableVariable

Constantes :
USERNAME_PATTERN
PASSWORD_PATTERN
*/


const inscriptionButton = document.getElementById('buttonInscription');
inscriptionButton.addEventListener('click', () =>{
    const username = document.getElementById('idInscription').value;
    const password = document.getElementById('idPassword').value;
    const confirmPassword = document.getElementById('confirmation').value;

    const errorText = document.getElementById("error");

    const USERNAME_PATTERN = /^.{4,16}$/
    const PASSWORD_PATTERN = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W]).{8,64})$/;

    if (password != confirmPassword) {
        console.error("Les mots de passe ne correspondent pas"); 
        errorText.textContent = "Les mots de passe ne correspondent pas"; 
        return; 
    };
    if (!USERNAME_PATTERN.test(username)) { 
        errorText.textContent = "Username invalide"; 
        return; 
    };
    if (!PASSWORD_PATTERN.test(password)) { 
        errorText.textContent = "Mot de passe invalide"; 
        return; 
    };

    fetch('/api/signup', {
        method: 'POST',
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"username": username, "password": password})
    }).then(function(res) { 
        return res.json();
    }).then(function(data) {
        console.log(data);
        if (data.message === "Account created") {
        window.location.href = "login";
    }
    }).catch(function(err) {
        console.error(err);
    })
});

const connexionButton = document.getElementById('loginButton').value;
connexionButton = addEventListener('click', () =>{
const loginUsername = document.getElementById('login').value;
const loginPassword = document.getElementById('password').value;

fetch('/api/login',{
method: 'POST',
headers: {
    "Content-type": "application/json",
},
body: JSON.stringify({"username": loginUsername, "password": loginPassword})
    }).then(function(res) { 
        return res.json();
    }).then(function(data) {
        console.log(data);
        if (data.message === "Connexion réussie") {
        window.location.href = "index";
    }
    }).catch(function(err) {
        console.error(err);
    })
});

// Appelle une route protégée avec le token
function verifierConnexion() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("Pas connecté");
        return;
    }

    fetch('/api/me', {
        headers: { "Authorization": "Bearer " + token }
    }).then(function(res) {
        return res.json();
    }).then(function(data) {
        if (data.error) {
            localStorage.removeItem("token"); // token expiré ou faux
            return;
        }
        console.log("Connecté en tant que " + data.username);
    }).catch(function(err) {
        console.error(err);
    });
}

verifierConnexion();

// Déconnexion : il suffit de supprimer le token
function deconnexion() {
    localStorage.removeItem("token");
    window.location.href = "login";
}
