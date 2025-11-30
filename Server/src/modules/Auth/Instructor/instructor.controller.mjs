import { validateInstructor, validateDataUpdateInstructor } from "./instructor.schema.mjs";

// Controlador que maneja las solicitudes relacionadas con los instructores
export class InstructorController {
    constructor({InstructorModel}){
        this.InstructorModel = InstructorModel;
    }

    // Controlador obtener a todos los instructores del sistema
    getAllInstructors = async (req, res) => {
        try{
            const result = await this.InstructorModel.getAllInstructors();
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                instructors: result.instructors
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor al obtener los instructores'});
        }
    }
    
    // Controlador para obtener el perfil de un instructor por su ID
    getInstructorById = async (req, res) => {
        const {instructorId} = req.params;
        try{
            const result = await this.InstructorModel.getInstructorById(instructorId);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({instructor: result.instructor});
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor al obtener el instructor'});
        }
    }

    // Controlador para obtener a los instructores según una categoria
    getInstructorByCategory = async (req, res) => {
        const {categoryInstructor} = req.params;
        try{
            const result = await this.InstructorModel.getInstructorByCategory(categoryInstructor);
            if(result.error) return res.status(404).json({error: result.error});
            return res.staus(200).json({
                message: result.message,
                instructors: result.instructors
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor al obtener los instructores por categoría'});
        }
    }

    // Controlador para que un instructor cree su perfil
    createInstructorProfile = async (req, res) => {
        if(!req.file) return {error: 'No se subió ninguna imagen de perfil'};
        const InstructorData = {
            ...req.body,
            user_id: parseInt(req.body.user_id),
            profile_picture: req.file.path,
            social_links: JSON.parse(req.body.social_links.trim())
        }
        const validation = validateInstructor(InstructorData);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: 'Datos inválidos para crear el perfil de instructor',
                    details: validation.error
                });
            }
            const result = await this.InstructorModel.createInstructorProfile(InstructorData);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(201).json({
                message: result.message,
                instructor: result.instructor
            });
        }
        catch(error){
            console.error(error);
            return res.status(500).json({error: 'Error del servidor al crear el perfil de instructor'});
        }
    }

    // Controlador para que un usuario siga a un instructor
    followInstructor = async (req, res) => {
        const {userId, instructorId} = req.params;
        try{
            const result = await this.InstructorModel.followInstructor(userId, instructorId);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({message: result.message});
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor al seguir al instructor'});
        }
    }

    // Controlador para actualizar los datos del perfil de un instructor
    updateInstructorProfile = async (req, res) => {
        if(!req.file) return {error: 'No se subió ninguna imagen de perfil'};
        const {instructorId} = req.params;
        const InstructorData = {
            ...req.body,
            profile_picture: req.body.profile_picture ? req.file.path : undefined,
            social_links: req.body.social_links ? 
            JSON.parse(req.body.social_links.trim()) : undefined
        }
        const validation = validateDataUpdateInstructor(InstructorData);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: 'Datos inválidos para actualizar el perfil de instructor',
                    details: validation.error
                })
            }
            const result = await this.InstructorModel.updateInstructorProfile(instructorId, InstructorData);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({message: result.message})
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor al actualizar el perfil de instructor'});
        }
    }

    // Controlador para eliminar el perfil de un instructor
    deleteInstructorProfile = async (req, res) => {
        const {instructorId} = req.params;
        try{
            const result = await this.InstructorModel.deleteInstructorProfile(instructorId);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({message: result.message});
        }
        catch(error){
            return res.status(500).json({error: 'Error del servidor al eliminar el perfil de instructor'});
        }
    }
}