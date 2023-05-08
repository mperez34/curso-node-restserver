import express from 'express';
import cors from 'cors';
import { router } from '../routes/usuarios.js';
import { router as routerCategorias } from '../routes/categorias.js';
import { router as routerAuth } from '../routes/auth.js';
import { router as routerProductos } from '../routes/productos.js';
import { router as routerBuscar } from '../routes/buscar.js';
import { router as rouertUploads } from '../routes/uploads.js';
import fileUpload from 'express-fileupload';
import { dbConnection } from '../database/config.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            usuarios: '/api/usuarios',
            buscar: '/api/buscar',
            auth: '/api/auth',
            categorias: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads'
        }

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use( cors() );
        // Lectura y parseo del body
        this.app.use( express.json() );
        //Directorio público
        this.app.use( express.static('public'));
        // Fileupload - carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
       this.app.use(this.paths.usuarios, router);
       this.app.use(this.paths.buscar, routerBuscar);
       this.app.use(this.paths.auth, routerAuth);
       this.app.use(this.paths.categorias, routerCategorias);
       this.app.use(this.paths.productos, routerProductos);
       this.app.use(this.paths.uploads, rouertUploads);
    }

    listen() {
        
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

export {Server};