import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { acceptedImage, acceptedVideo } from '../../core/utils/utils.mjs';

// Función para las configuraciones de Multer
export function configureMulter(directory){
    // Se verifica si existe el directorio
    if(!fs.existsSync(directory)){
        fs.mkdirSync(directory, {recursive: true});
    }
    // Configuración del almacenamiento
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, directory);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    })
    return multer({
        storage: storage,
        limits: {fileSize: 12 * 1024 * 1024}, // Limite de 12MB
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            if(!acceptedImage.includes(ext) && !acceptedVideo.includes(ext)){
                return cb(new Error('Solo se permiten archivos de imagen o video'));
            }
            cb(null, true);
        }
    });
}

// Middleware para subir imágenes y videos de cursos
const uploadCourses = path.resolve('uploads/courses');
const uploadInstructorProfiles = path.resolve('uploads/instructor');
const uploadUsers = path.resolve('uploads/users');

const multerCourses = configureMulter(uploadCourses);
const multerInstructorProfiles = configureMulter(uploadInstructorProfiles);
const multerUsers = configureMulter(uploadUsers);

export const uploadmiddlewareCourses = multerCourses.fields([
    {name: 'thumbnail_course', maxCount: 1},
    {name: 'preview_video', maxCount: 1}
]);
export const uploadMiddlewareInstructor = multerInstructorProfiles.single('profile_picture');
export const uploadMiddlewareUsers = multerUsers.single('avatar_imagen');