import { parse } from "dotenv";
import { validateResource, validateResourceUpdate } from "./resource.schema.mjs";

// Controlador que maneja las solicitudes relacionadas con los recursos de las lecciones
export class ResourceController {
    constructor({ResourceModel}){
        this.ResourceModel = ResourceModel;
    }

    // Controlador para obtener todos los recursos de una lección especifica
    getAllResourcesByLessonId = async (req, res) => {
        const { lessonId } = req.params;
        try{
            const result = await this.ResourceModel.getAllResourcesByLessonId(Number(lessonId));
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                resources: result.resources
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para obtener un recurso por su ID
    getResourceById = async (req, res) => {
        const { resourceId } = req.params;
        try{
            const result = await this.ResourceModel.getResourceById(Number(resourceId));
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                resource: result.resource
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para crear un nuevo recurso de una lección
    createResource = async (req, res) => {
        if(!req.file) return res.status(400).json({error: "El archivo del recurso es requerido"});
        const resourceData = {
            ...req.body,
            lesson_id: parseInt(req.body.lesson_id),
            file_url: req.file.path,
            file_size: parseInt(req.file.size)
        }
        const validation = validateResource(resourceData);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Error de validación",
                    details: validation.error
                })
            }
            const result = await this.ResourceModel.createResource(validation.data);
            if(result.error) return res.status(400).json({error: result.error});
            return res.status(201).json({
                message: result.message,
                resource: result.resource
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Método para actualizar un recurso de una lección
    updateResource = async (req, res) => {
        const { resourceId } = req.params;
        const resourceData = {
            ...req.body,
            file_url: req.file ? req.file.path : undefined,
            file_size: req.file ? parseInt(req.file.size) : undefined
        }
        const validation = validateResourceUpdate(resourceData);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Error de validación",
                    details: validation.error
                })
            }
            const result = await this.ResourceModel.updateResource(Number(resourceId), validation.data);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Método para eliminar un recurso de una lección
    deleteResource = async (req, res) => {
        const { resourceId } = req.params;
        try{
            const result = await this.ResourceModel.deleteResource(Number(resourceId));
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }
}