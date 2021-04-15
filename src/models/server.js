const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { connection } = require('../database/configuration');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/users',
            search: '/api/search',
            uploads: '/api/uploads'
        }

        // Connection to the database
        this.connectionDB();

        // Middlewares
        this.middlewares();

        // Paths of my application
        this.routes();
    }

    async connectionDB() {
        await connection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        this.app.use(express.urlencoded({ extended: false }));

        // Reading and parsing body
        this.app.use(express.json());

        // Public directory
        this.app.use(express.static('src/public'));

        // File Upload
        // Note that this option available for versions 1.0.0 and newer. 
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categories, require('../routes/categories.routes'));
        this.app.use(this.paths.products, require('../routes/product.routes'));
        this.app.use(this.paths.users, require('../routes/users.routes'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor escuchando en http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;