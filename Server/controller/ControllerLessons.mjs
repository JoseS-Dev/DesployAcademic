import { validateLesson, validateLessonUpdate } from "../validations/SchemaLessons.mjs";

export class ControllerLessons {
    constructor({ ModelLessons }) {
        this.ModelLessons = ModelLessons;
    }
    // Controlador para crear una nueva lección
    createLesson = async (req, res) => {
        const lessonData = { ...req.body };
        const { sectionId } = req.params;

        if (req.files?.thumbnail) {
            lessonData.thumbnail_url = req.files.thumbnail[0].path;
        }
        if (req.files?.video) {
            lessonData.video_url = req.files.video[0].path;
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