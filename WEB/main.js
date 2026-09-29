const inscriptionButton = document.getElementById('buttonInscription');
buttonInscription.addEventListener('click', () =>{
    const username = document.getElementById('idInscription').value;
    const password = document.getElementById('idPassword').value;
    const confirmPassword = document.getElementById('confirmation').value;

    const pattern = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W]).{8,64})/;
    if (pattern.test(password)) {
        console.log("nickel");
    } else {
        console.log("pas nickel");
        return;
    }

    if(password != confirmPassword){

        console.log("mots de passe different")
    }
    else(console.log("mots de passe valide"))

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

const connexionButton = document.getElementById('login');
Login.addEventListener('click', () =>{
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
