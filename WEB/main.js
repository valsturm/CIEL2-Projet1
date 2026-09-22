const { response } = require("express");

var indentifiant = document.getElementById('buttonId');
buttonId.addEventListener('click', function(){
    let loginInputValue = document.getElementById('login').value;

    let donnesAEnvoyer = {
        login: loginInputValue
    };

    fetch('/register', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(donnesAEnvoyer)
    })
    .then(res => res.json())
    .then(data => {
        console.log('succes', data);
        alert(data.message);
    })
    .catch((error) => {
        console.error('Erreur:', error);
    });
});