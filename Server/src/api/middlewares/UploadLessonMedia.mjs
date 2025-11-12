import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { acceptedImage, acceptedVideo } from '../utils.mjs';

// Función genérica reutilizable
function configureLessonMedia(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, directory),
        filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
    });

    return multer({
        storage,
        limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB máximo
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            const isImage = acceptedImage.includes(ext);
            const isVideo = acceptedVideo.includes(ext);

            if (!isImage && !isVideo) {
                return cb(new Error('Solo se permiten archivos de imagen o video'));
            }
            cb(null, true);
        }
    });
}

//  Directorios
const uploadDir = path.resolve('uploads/lessons');

//  Configuración del uploader
const upload = configureLessonMedia(uploadDir);

//  Middleware combinado
export const UploadLessonMedia = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 },
]);
