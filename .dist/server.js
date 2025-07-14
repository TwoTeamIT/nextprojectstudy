const express = require('express');
const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
    const server = express();

    // Middleware per gestire gli header
    server.use((req, res, next) => {
        res.setHeader('Cache-Control', 'no-store, must-revalidate');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        next();
    });

    // Gestione file statici
    server.use('/_next', express.static('./.next'));
    server.use(express.static('public'));

    // Gestione delle route di Next.js
    server.all('*', async (req, res) => {
        try {
            await handle(req, res);
        } catch (error) {
            console.error('Errore nella gestione della richiesta:', error);
            res.status(500).send('Errore interno del server');
        }
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Server pronto su http://localhost:${port}`);
    });
}); 