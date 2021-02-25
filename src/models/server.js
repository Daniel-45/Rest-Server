const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.usersPath = '/api/users'

        // Middlewares
        this.middlewares();

        // Paths of my application
        this.routes();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Reading and parsing body
        this.app.use(express.json());

        // Public directory
        this.app.use(express.static('src/public'));
    }

    routes() {
        this.app.use(this.usersPath, require('../routes/users.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor escuchando en http://localhost:${this.port}`);
        });
    }
}

module.exports = Server