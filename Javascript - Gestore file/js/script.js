const url = "http://127.0.0.1:8000/";
const form = document.getElementById("myForm");

async function onLoad_Setup() {
    try {
        const response = await fetch(url + "caricaFile");
        const data = await response.json();

        const contenuto = String.fromCharCode(...data);

        form.file.value = contenuto;
    } catch (error) {
        alert("Errore nel caricamento del file");
        console.error(error);
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const testo = form.file.value;

    const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testo),
    };

    fetch(url + "scriviFile", options)
        .then(response => response.json())
        .then((data) => {
            alert('File scritto con successo!');
        })
        .catch(error => {
            alert('Errore durante la scrittura del file');
        });
});