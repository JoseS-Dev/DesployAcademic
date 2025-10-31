import { validateCourseSection, validateCourseSectionUpdate } from "../validations/SchemaCourseSections.mjs";


export class ControllerCourseSections {
    constructor({ ModelCourseSection }) {
        this.ModelCourseSection = ModelCourseSection;
    }

    // obtener todas las secciones de un curso
    getSectionsByCourse = async (req, res) => {
        const courseId = req.params.courseId;
        try {
            const result = await this.ModelCourseSection.getSectionsByCourseId({ courseId });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ sections: result.sections });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // obtener una sección por su ID
    getSectionById = async (req, res) => {
        const sectionId = req.params.id;
        try {
            const result = await this.ModelCourseSection.getSectionById({ sectionId });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ section: result.section });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Controlador para crear una nueva sección de curso
    createCourseSection = async (req, res) => {
        const sectionData = req.body;
        // Validar los datos de la sección
        const validation = validateCourseSection(sectionData);
        if (!validation.success) {
            return res.status(400).json({ error: 'Datos de sección inválidos', details: validation.error.errors });
        }
        try {
            const result = await this.ModelCourseSection.createSection({ courseId: sectionData.course_id, sectionData: validation.data });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(201).json({ section: result.section, message: result.message });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    // Controlador para actualizar una sección de curso
    updateCourseSection = async (req, res) => {
        const sectionId = req.params.id;
        const updateData = req.body;
        // Validar los datos de actualización de la sección
        const validation = validateCourseSectionUpdate(updateData);
        if (!validation.success) {
            return res.status(400).json({ error: 'Datos de actualización inválidos', details: validation.error.errors });
        }
        try {
            const result = await this.ModelCourseSection.updateSection({ sectionId, sectionData: validation.data });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ section: result.section, message: result.message });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Controlador para eliminar una sección de curso
    deleteCourseSection = async (req, res) => {
        const sectionId = req.params.sectionId;
        try {
            const result = await this.ModelCourseSection.deleteSection({ sectionId });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ message: result.message });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    //controlador para eliminar todas las secciones de un curso
    deleteSectionsByCourse = async (req, res) => {
        const courseId = req.params.courseId;
        try {
            const result = await this.ModelCourseSection.deleteSectionsByCourseId({ courseId });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ message: result.message });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    //controlador para reordenar las secciones de un curso
    reorderCourseSections = async (req, res) => {
        const courseId = req.params.courseId;
        const { newOrder } = req.body;
        try {
            const result = await this.ModelCourseSection.reorderSections({ courseId, newOrder });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ message: result.message });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}