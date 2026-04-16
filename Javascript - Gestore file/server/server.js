const http = require('http');
const fs = require("fs");
const PORT = 8000;

const server = http.createServer((req, res) => {
    console.log(req.url);
    console.log(req.method);

    // Header CORS comuni
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Gestione preflight CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(200, corsHeaders);
        res.end();
        return;
    }

    if (req.method === 'GET') {
        if (req.url === '/caricaFile') {
            fs.readFile(__dirname + '/fileInput.txt', function (error, data) {
                if (error) {
                    res.writeHead(404, corsHeaders);
                    res.write(JSON.stringify({ error: 'file non trovato', details: String(error) }));
                    res.end();
                } else {
                    res.writeHead(200, Object.assign({
                        'Content-Type': 'application/json'
                    }, corsHeaders));
                    res.write(JSON.stringify(data.toJSON().data));
                    res.end();
                }
            });
            return;
        }
    }

    if (req.method === 'POST') {
        if (req.url === '/scriviFile') {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                let dataToWrite;
                try {
                    // Se il client invia JSON stringificato (es. "testo"), JSON.parse restituisce la stringa
                    dataToWrite = JSON.parse(body);
                } catch (parseErr) {
                    // Se non è JSON valido, usiamo il body così com'è
                    dataToWrite = body;
                }

                const nomeFile = __dirname + '/fileOutput.txt';

                fs.writeFile(nomeFile, dataToWrite, (err) => {
                    if (err) {
                        res.writeHead(400, Object.assign({
                            'Content-Type': 'application/json'
                        }, corsHeaders));
                        res.write(JSON.stringify({ esito: 'non riuscito', error: String(err) }));
                        res.end();
                    } else {
                        res.writeHead(200, Object.assign({
                            'Content-Type': 'application/json'
                        }, corsHeaders));
                        res.write(JSON.stringify({ esito: 'riuscito' }));
                        res.end();
                    }
                });
            });

            return;
        }
    }

    // Per tutte le altre richieste non gestite
    res.writeHead(404, corsHeaders);
    res.end();
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = server;