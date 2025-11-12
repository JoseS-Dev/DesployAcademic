import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { acceptedVideo } from '../utils.mjs';

// Función para configurar Multer específicamente para videos
function configureVideoMulter(directory) {
    // Crear el directorio si no existe
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    // Configuración de almacenamiento
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, directory);
        },
        filename: (req, file, cb) => {
            // Se agrega timestamp para evitar nombres repetidos
            const timestamp = Date.now();
            cb(null, `${timestamp}-${file.originalname}`);
        }
    });

    // Configuración del middleware Multer
    return multer({
        storage: storage,
        limits: {
            fileSize: 200 * 1024 * 1024 // Límite: 200 MB
        },
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            const isVideo = acceptedVideo.includes(ext);

            if (!isVideo) {
                return cb(new Error('Solo se permiten archivos de video'));
            }

            cb(null, true);
        }
    });
}


// 📁 Carpeta destino para los videos
const uploadDirVideos = path.resolve('uploads/lessons');
//carpeta para las previsualizaciones de los videos
const uploadDirVideoPreviews = path.resolve('uploads/lesson_previews');

// 🎥 Configuración del uploader
const uploadVideo = configureVideoMulter(uploadDirVideos);
const uploadVideoPreview = configureVideoMulter(uploadDirVideoPreviews);

// Middleware para subir previsualizaciones de video (maneja un solo campo llamado "video_preview")
export const UploadVideoPreview = uploadVideoPreview.single('video_preview');

// Middleware final (maneja un solo campo llamado "lesson_video")
export const UploadVideo = uploadVideo.single('lesson_video');
