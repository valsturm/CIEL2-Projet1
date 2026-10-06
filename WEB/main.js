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

    const USERNAME_PATTERN = /.{4,16}/
    const PASSWORD_PATTERN = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W]).{8,64})/;

    console.log(USERNAME_PATTERN.test(password));
    console.log(PASSWORD_PATTERN.test(password));
    console.log(password == confirmPassword);

    if (!USERNAME_PATTERN.test(username)) { 
        errorText.textContent = "Username invalide"; 
        return; 
    };
    if (!PASSWORD_PATTERN.test(password)) { 
        errorText.textContent = "Mot de passe invalide"; 
        return; 
    };
    if (password != confirmPassword) {
        console.error("Les mots de passe ne correspondent pas"); 
        errorText.textContent = "Les mots de passe ne correspondent pas"; 
        return; 
    };

    fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*"
        },
        mode: "no-cors",
        body: JSON.stringify({"username": "test", "password": "Testtest1!"})
    }).then(function(res) { 
        return res.json();
    }).then(function(data) {
        console.log(data);
    }).catch(function(err) {
        console.error(err);
    })
});

