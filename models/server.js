const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT ?? 8080;

        this.paths = {
            // auth: '/api/auth',
            // categorias: '/api/categorias',
            // productos: '/api/productos',
            // usuarios: '/api/usuarios',
            // uploads: '/api/uploads',
            executejobs: '/api/executejobs',
            jobs: '/api/jobs',
            search: '/api/search',
        };

        // Conectar a la BD
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi app
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del Body (JSON)
        this.app.use(express.json());

        // Directorio público
        this.app.use(express.static('public'));
    }

    // Método
    routes() {
        // this.app.use(this.paths.auth, require('../routes/auth.routes'));
        // this.app.use(this.paths.buscar, require('../routes/buscar.routes'));
        // this.app.use(this.paths.categorias, require('../routes/categorias.routes'));
        // this.app.use(this.paths.productos, require('../routes/productos.routes'));
        // this.app.use(this.paths.usuarios, require('../routes/usuarios.routes'));
        // this.app.use(this.paths.uploads, require('../routes/uploads.routes'));
        this.app.use(this.paths.executejobs, require('../routes/executejobs.routes'));
        this.app.use(this.paths.jobs, require('../routes/jobs.routes'));
        this.app.use(this.paths.search, require('../routes/search.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`*-* Servidor corriendo en puerto: ${this.port} *-*`);
        })
    }
}





module.exports = Server;