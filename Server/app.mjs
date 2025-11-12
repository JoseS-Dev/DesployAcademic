import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { CONFIG_SERVER } from './config/config.mjs';
import { RoutesModules} from './src/api/Route/route.modules.mjs';
import { registerRoutes } from './src/core/utils/function.mjs';


// Inicio servidor
const app = express();

app.use(json());
app.use(cors());
app.use(morgan('dev'));

// Rutas estaticas para imagenes y videos
app.use('/uploads/images', express.static('uploads/images'));
app.use('/uploads/videos', express.static('uploads/videos'));
app.use('/uploads/lessons', express.static('uploads/lessons'));

// Rutas
registerRoutes(app, RoutesModules);


// Escucho Servidor
if (CONFIG_SERVER.node !== 'test' || CONFIG_SERVER.node !== 'production') {
    app.listen(CONFIG_SERVER.port, () => {
        console.log(`Servidor escuchando en ${CONFIG_SERVER.host}:${CONFIG_SERVER.port}`);
    })
}

export default app;