import { validateInstructor, validateInstructorUpdate } from "../validations/SchemaInstructors.mjs";

export class ControllerInstructors {
    constructor({ ModelInstructor }) {
        this.ModelInstructor = ModelInstructor;
    }
    // Controlador para crear un nuevo instructor
    registerInstructor = async (req, res) => {
        const instructorData = req.body;
        // Validar los datos del instructor
        const validation = validateInstructor(instructorData);
        if (!validation.success) {
            return res.status(400).json({ error: 'Datos de instructor inválidos', details: validation.error.errors });
        }
        try {
            const result = await this.ModelInstructor.registerInstructor({ userId: instructorData.user_id, description: validation.data });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(201).json({ instructor: result.instructor, message: result.message });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Controlador para obtener todos los instructores
    getAllInstructors = async (req, res) => {
        try {
            const result = await this.ModelInstructor.getAllInstructors();
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ instructors: result.instructors });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    // Controlador para obtener un instructor por su ID
    getInstructorById = async (req, res) => {
        const instructorId = req.params.id;
        try {
            const result = await this.ModelInstructor.getInstructorById({ instructorId });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ instructor: result.instructor });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Controlador para actualizar un instructor
    updateInstructorProfile = async (req, res) => {
        const instructorId = req.params.id;
        const profileData = req.body;
        // Validar los datos del instructor
        const validation = validateInstructorUpdate(profileData);
        if (!validation.success) {
            return res.status(400).json({ error: 'Datos de instructor inválidos', details: validation.error.errors });
        }
        try {
            const result = await this.ModelInstructor.updateInstructorProfile({ instructorId, profileData: validation.data });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ instructor: result.instructor, message: result.message });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}