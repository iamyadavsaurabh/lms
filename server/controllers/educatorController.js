import { v2 as cloudinary } from 'cloudinary'
import Course from '../models/Course.js';
// import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';
import { clerkClient } from '@clerk/express'
import { Purchase } from '../models/Purchase.js';



// function that update role of educator
// update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            },
        })
        res.json({ success: true, message: 'You can publish a course now' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// function to adding a course
// Add New Course and help us to upload the course on the data base
export const addCourse = async (req, res) => {

    try {

        const { courseData } = req.body

        const imageFile = req.file

        const educatorId = req.auth.userId

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' })
        }

        const parsedCourseData = await JSON.parse(courseData)  // parsing the course data from JSON string to object 

        parsedCourseData.educator = educatorId

        const newCourse = await Course.create(parsedCourseData)  // store course data in database

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)  // upload image to cloudinary

        newCourse.courseThumbnail = imageUpload.secure_url  // set the course thumbnail to the uploaded image URL

        await newCourse.save() // save the course with thumbnail URL in database

        res.json({ success: true, message: 'Course Added' })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}

// function to get all courses of educator
// Get All Courses of Educator
export const getEducatorCourses = async (req, res) => {
    try {
        const educator = req.auth.userId  // Get the educator's user ID from the request authentication
        const courses = await Course.find({ educator }) // Find all courses associated with the educator's ID
        res.json({ success: true, courses })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// get educator dashboard data for total courses and total earnings and number of students
export const getEducatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId; // Get the educator's user ID from the request authentication

        // Fetch all courses created by the educator
        const courses = await Course.find({ educator });

        const totalCourses = courses.length; // Count the total number of courses

        const courseIds = courses.map(course => course._id); // Extract course IDs of each courses for further processing

        // Calculate total earnings from purchases related to the educator's courses
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0); // Sum up the amounts of completed purchases

        // collect the student ID with course title enrolled in the courses
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students= await User.find({ _id: { $in: course.enrolledStudents } }, 'name imageURL'); // Fetch student details for each course
            // Push each student's data along with the course title into the enrolledStudentsData array
            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({ success:true, dashboardData: {totalEarnings,enrolledStudentsData,totalCourses} });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// function to get enrolled students data with purchase details
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId; // Get the educator's user ID from the request authentication

        // Fetch all courses created by the educator
        const courses = await Course.find({ educator });

        const courseIds = courses.map(course => course._id); // Extract course IDs of each courses for further processing

        // Fetch all purchases related to the educator's courses
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageURL').populate('courseId', 'courseTitle'); // Populate userId to get user details
        
        // Map through the purchases to create an array of enrolled students with course details
        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId, // This will contain the user details of the student
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({ success: true, enrolledStudents });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
