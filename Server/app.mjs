import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { CONFIG_SERVER } from './config/config.mjs';
import { RoutesModules } from './src/api/Route/route.modules.mjs';



// Inicio servidor
const app = express();

app.use(json());
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(morgan('dev'));

// Rutas estaticas para imagenes y videos
app.use('/uploads/courses', express.static('uploads/courses'));
app.use('/uploads/instructor', express.static('uploads/instructor'));
app.use('/uploads/users', express.static('uploads/users'));

// Rutas
app.use(RoutesModules);


// Escucho Servidor
if (CONFIG_SERVER.node !== 'test' || CONFIG_SERVER.node !== 'production') {
    app.listen(CONFIG_SERVER.port, () => {
        console.log(`Servidor escuchando en ${CONFIG_SERVER.host}:${CONFIG_SERVER.port}`);
    })
}

export default app;