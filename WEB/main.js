const button = document.getElementById('buttonId');
button.addEventListener('click', () => {
    const username = document.getElementById("login").value;
    const mdp = document.getElementById("login").value;
    const body = JSON.stringify({username, mdp});

    fetch('/api/register', {
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

const inscriptionButton = document.getElementById('buttonInscription');
buttonInscription.addEventListener('click', () =>{
    const username = document.getElementById('idInscription').value;
    const password = document.getElementById('idPassword').value;
})