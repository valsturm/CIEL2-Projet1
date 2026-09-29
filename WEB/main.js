/* INSCRIPTION
- Récuperer la valeur du nom d'utilisateur, du mot de passe et de la confirmation du mot de passe
- Vérifier dans l'ordre :
    -> Si les mots de passe correspondent
    -> Si le mot de passe est correct, regex : /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W]).{8,64})/
    -> Si le nom d'utilisateur est correct, regex : /.{4,16}/
- Fetch l'api

Si il y a une erreur, l'afficher dans la console ET l'afficher sur l'écran de l'utilisateur
*/


const inscriptionButton = document.getElementById('buttonInscription');
buttonInscription.addEventListener('click', () =>{
    const username = document.getElementById('idInscription').value;
    const password = document.getElementById('idPassword').value;
    const confirmPassword = document.getElementById('confirmation').value;

    const errorText = document.getElementById("error");

    const usernamePattern = /.{4,16}/
    const passwordPattern = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W]).{8,64})/;

    console.log(usernamePattern.test(password));
    console.log(passwordPattern.test(password));
    console.log(password != confirmPassword);

    if (!usernamePattern.test(password)) { 
        errorText.textContent = "Username invalide"; 
        return; 
    };
    if (!passwordPattern.test(password)) { 
        errorText.textContent = "Mot de passe invalide"; 
        return; 
    };
    if (password != confirmPassword) { 
        errorText.textContent = "Les mots de passe ne correspondent pas"; 
        return; 
    };

    const body = JSON.stringify({username, password});

    fetch('/api/signup', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            body
        }
    }).then(res => res.json())
    .catch((error, res) => {
        console.error(error, res);
    })
});

/*
const connexionButton = document.getElementById('buttonId');
connexionButton.addEventListener('click', () =>{
    const loginUsername = document.getElementById('login').value;
    const loginPassword = document.getElementById('password').value;

    const body = JSON.stringify({loginUsername, loginPassword});

    fetch('/api/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            body
        }
    }).then(res => res.json())
    .catch((error, res) => {
        console.error(error, res);
    })
});
*/