**📚 Documentación del Proyecto**

Este documento describe la estructura de la carpeta `Server` y las responsabilidades de sus subcarpetas y archivos más importantes.

**📁 Raíz de `Server`**:
- `app.mjs`: Punto de entrada de la aplicación. Inicializa el servidor, carga middleware global y monta las rutas.
- `package.json`: Dependencias y scripts del proyecto.
- `.env` / `.example.env`: Variables de entorno utilizadas por la aplicación.

**⚙️ `config/`**:
- `config.mjs`: Archivo de configuración central. Normalmente contiene la lectura de variables de entorno y la exportación de objetos de configuración (puertos, rutas de subida, conexión a BD, etc.).

**🗄️ `database/`**:
- `db.mjs`: Lógica de conexión a la base de datos (configuración del cliente, cadena de conexión, inicialización de la conexión).
- `table.sql`: Script SQL con la estructura de tablas usada por el proyecto (esquema inicial).
- `seed/seed.database.mjs`: Scripts para insertar datos iniciales (seeders) en la base de datos para desarrollo y pruebas.

**🧩 `src/`**: Contiene el código fuente modular del servidor.

- `api/` 🚪:
  - `middlewares/` 🛡️:
    - `auth.middleware.mjs`: Middleware de autenticación/validación de tokens y permisos.
    - `multer.middleware.mjs`: Configuración de `multer` para manejo de uploads (destinos, filtros, límites).
  - `Route/` 🔀:
    - `route.modules.mjs`: Punto donde se registran/montan las rutas principales del servidor (conexión entre rutas de módulos y la app).

- `core/` 🧰:
  - `utils/` 🧩:
    - `function.mjs` y `utils.mjs`: Utilidades compartidas (helpers, formateo, manejo de errores, validaciones comunes). Estas funciones son consumidas por controllers y servicios.

- `mocks/` 🧪:
  Contiene datos falsos para pruebas y desarrollo local. Está organizado por dominios.
  - `Auth/`: mocks de usuarios, roles, sesiones (`users.mock.mjs`, `role.mock.mjs`, `login_sessions.mock.mjs`).
  - `Categories/`, `Course/`, `Lessons/`, `Sections/`: Cada carpeta agrupa mocks relacionados con ese dominio (por ejemplo `courses.mock.mjs`, `lessons.mock.mjs`, `resources.mock.mjs`).
  - `index.mjs`: Punto de exportación/agrupación de mocks.

- `modules/` 📦:
  Organización por dominios, cada uno con la estructura típica de una API REST.
  En cada módulo suele repetirse la siguiente convención de archivos:
  - `*.route.mjs` 🔗: Define las rutas HTTP (endpoints) del recurso.
  - `*.controller.mjs` 🎛️: Contiene las funciones que manejan la lógica por endpoint (reciben req/res y llaman a models/servicios).
  - `*.model.mjs` 🗃️: Abstracción sobre acceso a datos (consultas a BD, mapeo de objetos). Puede ser un simple wrapper sobre consultas SQL o llamadas a un ORM.
  - `*.schema.mjs` ✅: Definición de schemas/validaciones (por ejemplo con Joi o Zod) para validar solicitudes.

  Módulos presentes:
  - `Auth/`:
    - `Instructor/`: `instructor.controller.mjs`, `instructor.model.mjs`, `instructor.route.mjs`, `instructor.schema.mjs` — rutas y lógica de la autenticación/gestión de instructores.
    - `Users/`: gestión de usuarios (`users.controller.mjs`, `users.model.mjs`, `users.route.mjs`, `users.schema.mjs`).
  - `Categories/`:
    - `categories/`: CRUD de categorías (`categorie.controller.mjs`, `categorie.model.mjs`, `categorie.route.mjs`, `categorie.schema.mjs`).
  - `Courses/`:
    - `course/`: Gestión de cursos (`course.controller.mjs`, `course.model.mjs`, `course.route.mjs`, `course.schema.mjs`).
    - `lessons/`:
      - `lesson/`: Rutas y lógica para lecciones (`lesson.controller.mjs`, `lesson.model.mjs`, `lesson.route.mjs`, `lesson.schema.mjs`).
      - `resources/`: Recursos adjuntos a lecciones (`resource.controller.mjs`, `resource.model.mjs`, `resource.route.mjs`, `resource.schema.mjs`).
    - `sections_course/`: Gestión de secciones dentro de cursos (`section.controller.mjs`, `section.model.mjs`, `section.route.mjs`, `section.schema.mjs`).
  - `Enrollment/`: Manejo de inscripciones (`enrollment.controller.mjs`, `enrollment.model.mjs`, `enrollment.route.mjs`, `enrollment.schema.mjs`).
  - `Reviews/`: Reseñas y valoraciones de cursos (`review.controller.mjs`, `review.model.mjs`, `review.route.mjs`, `review.schema.mjs`).

**🧾 `test/`**:
- Contiene colecciones o peticiones HTTP para pruebas manuales con herramientas como REST Client (VSCode) o similares: `Courses.http`, `enrollment.http`, `instructor.http`, `lessons.http`, `resources.http`, `sections.http`, `users.http`.

**🗂️ `uploads/`**:
- Carpeta para almacenar archivos subidos (imágenes, recursos, etc.). Subcarpetas por tipo: `courses/`, `instructor/`, `instructors/`, `lessons/`, `resources/`, `users/`.

**🔁 Convenciones y flujo general**:
- Cada recurso (por ejemplo `courses`, `users`, `lessons`) sigue el patrón `route -> controller -> model`.
- `schema` se utiliza para validar entrada de datos antes de procesarlos en el `controller`.
- `middlewares` (en `api/middlewares`) se aplican a rutas para tareas transversales: auth, manejo de archivos, logging, etc.
- `mocks` se usan para poblar datos en desarrollo o pruebas sin tocar la BD real.

**🔑 Archivos clave para revisar al trabajar**:
- `app.mjs`: Ver cómo se montan las rutas y middlewares.
- `config/config.mjs`: Revisar variables de entorno y opciones globales.
- `database/db.mjs` y los scripts en `database/seed/` si necesita preparar la BD.
- `src/modules/*/*.route.mjs`: Para conocer los endpoints disponibles.

**💡 Sugerencias rápidas**:
- Para añadir un nuevo recurso, seguir la convención `modules/<Recurso>/{<recurso>.route.mjs, <recurso>.controller.mjs, <recurso>.model.mjs, <recurso>.schema.mjs}`.
- Usar los mocks para testear sin persistencia: `src/mocks`.
- Si subes archivos, revisa `api/middlewares/multer.middleware.mjs` y las rutas que aceptan uploads.

---

Si quieres, puedo:
- Añadir ejemplos de endpoints concretos extraídos de los archivos `*.route.mjs`.
- Generar un `README` resumen en inglés/español o preparar scripts de `npm`/`pnpm` para inicializar la BD usando los seeders.

Archivo creado: `documents.md` en la raíz de la carpeta `Server`.

**🔗 Ejemplos de endpoints (con `BASE_PATH` por defecto `/api/v1`)**
- Usuarios:
  - `GET /api/v1/users/all` — Obtener todos los usuarios (protegido, admin).
  - `POST /api/v1/users/register` — Registrar un nuevo usuario.
  - `POST /api/v1/users/login` — Login de usuario.
  - `POST /api/v1/users/logout/:userId` — Logout de usuario.
  - `PATCH /api/v1/users/update/:userId` — Actualizar datos del usuario (usa `multer` para avatar, protegido).
  - `GET /api/v1/users/:userId` — Obtener usuario por ID.

- Instructores:
  - `GET /api/v1/instructors/all` — Obtener todos los instructores.
  - `POST /api/v1/instructors/create-profile` — Crear perfil de instructor (subida de archivos posible).
  - `PATCH /api/v1/instructors/update-profile/:instructorId` — Actualizar perfil de instructor.

- Cursos:
  - `GET /api/v1/courses/all` — Obtener todos los cursos.
  - `GET /api/v1/courses/instructor/:instructorId` — Cursos por instructor.
  - `GET /api/v1/courses/slug/:slug` — Buscar curso por slug.
  - `POST /api/v1/courses/create` — Crear un nuevo curso (soporta upload de imagen/archivos).
  - `PATCH /api/v1/courses/course/:courseId/update` — Actualizar curso.
  - `PATCH /api/v1/courses/course/:courseId/change-status` — Cambiar estado publicado/no publicado.

- Secciones y lecciones:
  - `GET /api/v1/courses/sections/:sectionId` — (según implementación) rutas de secciones.
  - `GET /api/v1/courses/lessons/section/:sectionId` — Obtener lecciones por sección.
  - `POST /api/v1/courses/lessons/create` — Crear lección en una sección (upload posible).
  - `PATCH /api/v1/courses/lessons/lesson/:lessonId/update` — Actualizar lección.

- Recursos de lecciones:
  - `GET /api/v1/courses/lessons/resources/lesson/:lessonId/all` — Obtener recursos de una lección.
  - `POST /api/v1/courses/lessons/resources/create` — Crear recurso (upload).

- Categorías:
  - `GET /api/v1/categories/all` — Obtener todas las categorías.
  - `POST /api/v1/categories/create` — Crear categoría.

- Inscripciones (Enrollment):
  - `POST /api/v1/enrollments/enroll/create` — Inscribir a un estudiante en un curso.
  - `GET /api/v1/enrollments/course/:courseId/students` — Obtener estudiantes inscritos en un curso.

Estos ejemplos se han extraído de las rutas en `src/modules/*/*/*.route.mjs` y `src/api/Route/route.modules.mjs`.

**🧾 Atajos de scripts (`package.json`) y comandos `pnpm`**
- `dev` ▶️: Ejecuta el servidor en modo desarrollo con `nodemon`.
- `seed` ⛏️: Ejecuta el archivo de seed definido en `database/seed/seed.database.mjs`.
- `test` 🧪: Script de prueba por defecto (placeholder).

Comandos útiles (PowerShell / Windows):
```
pnpm run dev
pnpm run seed
pnpm test
```

