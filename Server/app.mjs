import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { CONFIG_SERVER } from './config/config.mjs';
import { RouteAuth } from './api/RouteAuth.mjs';
import { RouteCourses } from './api/RouteCourses.mjs';
import { RouteCategory } from './api/RouteCategory.mjs';


// Inicio servidor
const app = express();

app.use(json());
app.use(cors());
app.use(morgan('dev'));

// Rutas
app.use(`${CONFIG_SERVER.basePath}/auth`, RouteAuth);
app.use(`${CONFIG_SERVER.basePath}/courses`, RouteCourses);
app.use(`${CONFIG_SERVER.basePath}/categories`, RouteCategory);

// Escucho Servidor
if (CONFIG_SERVER.node !== 'test' || CONFIG_SERVER.node !== 'production') {
    app.listen(CONFIG_SERVER.port, () => {
        console.log(`Servidor escuchando en ${CONFIG_SERVER.host}:${CONFIG_SERVER.port}`);
    })
}

export default app;