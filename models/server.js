const express = require('express');
const cors = require('cors')
class Server {

    constructor() {
        this.port = process.env.PORT;
        this.app = express();
        this.middlewares();
        this.usuariosPath = '/api/usuarios';

        this.routes();

    }
    middlewares() {
        // Cors
        // Parseo y lectura de datos de body
        this.app.use(express.json());

        this.app.use(cors());
        this.app.use(express.static('public'));
    }
    routes() {
        this.app.use(this.usuariosPath, require('../routes/user'));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;