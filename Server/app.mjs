import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { CONFIG_SERVER } from './config/config.mjs';
import { RouteAuth } from './api/RouteAuth.mjs';
import { RouteCourses } from './api/RouteCourses.mjs';
import { RouteCategory } from './api/RouteCategory.mjs';
import { RouteInstructors } from './api/RouteInstructors.mjs';
import { RouteLessons } from './api/RouteLessons.mjs';
import { RouteCourseSections } from './api/RouteCourseSections.mjs';


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
app.use(`${CONFIG_SERVER.basePath}/auth`, RouteAuth);
app.use(`${CONFIG_SERVER.basePath}/courses`, RouteCourses);
app.use(`${CONFIG_SERVER.basePath}/categories`, RouteCategory);
app.use(`${CONFIG_SERVER.basePath}/instructors`, RouteInstructors);
app.use(`${CONFIG_SERVER.basePath}/lessons`, RouteLessons);
app.use(`${CONFIG_SERVER.basePath}/sections`, RouteCourseSections);

// Escucho Servidor
if (CONFIG_SERVER.node !== 'test' || CONFIG_SERVER.node !== 'production') {
    app.listen(CONFIG_SERVER.port, () => {
        console.log(`Servidor escuchando en ${CONFIG_SERVER.host}:${CONFIG_SERVER.port}`);
    })
}

export default app;