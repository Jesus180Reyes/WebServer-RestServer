const express = require('express');
const cors = require('cors');
const { dbConecction } = require('../db/config');
class Server {

    constructor() {
        // Inicializar variables
        this.port = process.env.PORT;
        this.app = express();
        // MiddleWare;
        this.middlewares();
        // Path de usuarios
        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categories: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
        };
        // this.usuariosPath = '/api/usuarios';
        // this.authPath = '/api/auth';
        // Conectar a Base DE datos
        this.DbConecction();

        // Rutas de la API
        this.routes();

    }
    async DbConecction() {
        await dbConecction();
    }
    middlewares() {
        // Cors
        // Parseo y lectura de datos de body
        this.app.use(express.json());

        this.app.use(cors());
        this.app.use(express.static('public'));
    }
    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.usuarios, require('../routes/user'));
        this.app.use(this.paths.categories, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;