import express from 'express';
import { getUserData, getEnrolledCourses,purchaseCourse,updateUserCourseProgress,getUserCourseProgress,addUserRating } from '../controllers/userController.js';

const userRouter = express.Router();
userRouter.get('/data', getUserData);// Get user data
userRouter.get('/enrolled-courses', getEnrolledCourses); // Get enrolled courses
userRouter.post('/purchase', purchaseCourse); // Purchase course and generate payment link

userRouter.post('/update-course-progress', updateUserCourseProgress); // Update user course progress
userRouter.post('/get-course-progress', getUserCourseProgress); // Get user course progress
userRouter.post('/add-rating', addUserRating); // Add user rating to course

export default userRouter;