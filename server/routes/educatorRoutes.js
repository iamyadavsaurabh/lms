import express from 'express';
import { addCourse,updateRoleToEducator,getEducatorCourses,getEducatorDashboardData,getEnrolledStudentsData} from '../controllers/educatorController.js';
import { protectEducator } from '../middlewares/authMiddleware.js';
import upload from '../configs/multer.js'; // Assuming you have a multer configuration file for handling file uploads


const educatorRouter = express.Router();

// Route to update user role to educator
educatorRouter.post('/update-role', updateRoleToEducator)

// Route to add a new course, protected by the educator middleware
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse)

// route for educator course functionality
// This route allows educators to add a new course, requiring authentication and file upload handling
educatorRouter.get('/courses', protectEducator, getEducatorCourses)

// Route to get the dashboard data for the educator
educatorRouter.get('/dashboard', protectEducator, getEducatorDashboardData)

// Route to get enrolled students data with purchase details
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData);

export default educatorRouter; 