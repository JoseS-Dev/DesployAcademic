import {Router} from 'express';
import { CONFIG_SERVER } from '../../../config/config.mjs';
import { userRoute } from '../../modules/Auth/Users/users.route.mjs';
import { instructorRoute } from '../../modules/Auth/Instructor/instructor.route.mjs';
import { courseRoute } from '../../modules/Courses/course/course.route.mjs';
import { sectionRoute } from '../../modules/Courses/sections_course/section.route.mjs';


const router = Router();

export const RoutesModules = {
    users: {
        user: router.use(`${CONFIG_SERVER.basePath}/users`, userRoute),
        instructor: router.use(`${CONFIG_SERVER.basePath}/instructors`, instructorRoute)
    },
    courses: {
        course: router.use(`${CONFIG_SERVER.basePath}/courses`, courseRoute),
        section: router.use(`${CONFIG_SERVER.basePath}/courses/sections`, sectionRoute)
    }
}