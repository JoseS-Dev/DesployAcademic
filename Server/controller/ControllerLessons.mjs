import { validateLesson, validateLessonUpdate } from "../validations/SchemaLessons.mjs";

function parseLessonData(body) {
    return {
        ...body,
        video_duration: body.video_duration ? Number(body.video_duration) : undefined,
        lesson_order: body.lesson_order ? Number(body.lesson_order) : undefined,
        is_preview: body.is_preview === 'true',
        is_published: body.is_published === 'true',
    };
}

export class ControllerLessons {
    constructor({ ModelLessons }) {
        this.ModelLessons = ModelLessons;
    }
    // Controlador para crear una nueva lección
    createLesson = async (req, res) => {
        const lessonData = parseLessonData(req.body);
        const sectionId = req.body.section_id;

        if (req.files?.thumbnail) {
            const filePath = req.files.thumbnail[0].path;
            console.log("Thumbnail file path:", filePath);
            lessonData.thumbnail_url = `http://localhost:4300/uploads${filePath.split('uploads')[1].replace(/\\/g, '/')}`;
        }
        if (req.files?.video) {
            const filePath = req.files.video[0].path;
            lessonData.video_url = `http://localhost:4300/uploads${filePath.split('uploads')[1].replace(/\\/g, '/')}`;
        }

        // Validar los datos de la lección
        const validation = validateLesson(lessonData);
        try {
            if (!validation.success) {
                return res.status(400).json({ error: 'Datos de lección inválidos', details: validation.error.errors });
            }
            const result = await this.ModelLessons.createLesson({ sectionId, lessonData: validation.data });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(201).json({ lesson: result.lesson, message: result.message });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Controlador para obtener lecciones por curso
    getLessonsBySection = async (req, res) => {
        const { sectionId } = req.params;
        try {
            const result = await this.ModelLessons.getLessonsBySection({ sectionId });
            if (result.error) return res.status(404).json({ error: result.error });
            return res.status(200).json({ lessons: result.lessons, message: result.message });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // metodo para obtener una lección por su ID
    getLessonById = async (req, res) => {
        const { lessonId } = req.params;
        try {
            const result = await this.ModelLessons.getLessonById({ lessonId });
            if (result.error) return res.status(404).json({ error: result.error });
            return res.status(200).json({ lesson: result.lesson, message: result.message });
        }
        catch (error) {

            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Controlador para actualizar una lección existente
    updateLesson = async (req, res) => {
        const { lessonId } = req.params;
        const lessonData = { ...req.body };
        if (req.files?.thumbnail) {
            lessonData.thumbnail_url = req.files.thumbnail[0].path;
        }
        if (req.files?.video) {
            lessonData.video_url = req.files.video[0].path;
        }
        // Validar los datos de la lección
        const validation = validateLessonUpdate(lessonData);
        try {
            if (!validation.success) {
                return res.status(400).json({ error: 'Datos de lección inválidos', details: validation.error.errors });
            }
            const result = await this.ModelLessons.updateLesson({ lessonId, lessonData: validation.data });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ lesson: result.lesson, message: result.message });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Controlador para eliminar una lección
    deleteLesson = async (req, res) => {
        const { lessonId } = req.params;
        try {
            const result = await this.ModelLessons.deleteLesson({ lessonId });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ lesson: result.lesson, message: result.message });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}