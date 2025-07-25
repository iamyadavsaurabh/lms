import User from '../models/User.js';
import {Purchase} from '../models/Purchase.js';
import Stripe from 'stripe';
import Course from '../models/Course.js';
import CourseProgress from '../models/CourseProgress.js';




//  function to get all users data
// This function retrieves the user data based on the user ID from the request object
export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId; // Get user ID from the request object
        const user = await User.findById(userId); // Find user by ID in the database

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// user enrolled courses with lecture link
export const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId; // Get user ID from the request object
        const userData = await User.findById(userId).populate('enrolledCourses'); // Find user by ID and populate enrolled courses
        res.json({ success: true, enrolledCourses: userData.enrolledCourses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// genrate the payemnt link using stripe
// purchase course function
export const purchaseCourse = async (req, res) => {

    try {
        const { courseId } = req.body; // Extract course ID from request body
        const { origin } = req.headers; // Get the origin from request headers
        const userId = req.auth.userId; // Get user ID from the request authentication
        const userData = await User.findById(userId); // get user data
        const courseData = await Course.findById(courseId); // Find the course by ID
        
        // if any of userdata or course data missiing
        if (!courseData || !userData) {
            return res.json({ success: false, message: 'Data not found' });
        }

        // create a purchase data
        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - (courseData.coursePrice * courseData.discount / 100)).toFixed(2), // Calculate the amount after discount
        }

        // store the purchase data in the database
        const newPurchase = await Purchase.create(purchaseData);

        // create a payment link using stripe
        // intilise stripe gateway
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        const currency = process.env.CURRENCY.toLowerCase(); // Get the currency from environment variables

        // creating line items to for stripe
        const line_items = [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: courseData.courseTitle,
                    },
                    unit_amount: Math.floor(newPurchase.amount) * 100, // Convert amount to cents
                },
                quantity: 1,
            },
        ];

        // using line items to create a payment link
        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`, // Success URL after payment
            cancel_url: `${origin}/`, // Cancel URL if payment is cancelled
            line_items:  line_items, // Line items for the payment
            mode: 'payment', // Payment mode
            metadata: {
                purchaseId: newPurchase._id.toString(), // Store purchase ID in metadata
            },
        });

        // return the session id to the client
        res.json({ success: true, session_url: session.url });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {

    try {

        const userId = req.auth.userId // Get user ID from the request authentication

        const { courseId, lectureId } = req.body // Extract course ID and lecture ID from request body

        const progressData = await CourseProgress.findOne({ userId, courseId }) // Find existing progress data for the user and course

        if (progressData) {

            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: 'Lecture Already Completed' })
            }

            progressData.lectureCompleted.push(lectureId)
            await progressData.save()

        } else {

            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })

        }

        res.json({ success: true, message: 'Progress Updated' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// get User Course Progress
export const getUserCourseProgress = async (req, res) => {

    try {

        const userId = req.auth.userId

        const { courseId } = req.body

        const progressData = await CourseProgress.findOne({ userId, courseId })

        res.json({ success: true, progressData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Add User Ratings to Course
export const addUserRating = async (req, res) => {

    const userId = req.auth.userId;
    const { courseId, rating } = req.body;

    // Validate inputs
    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: 'InValid Details' });
    }

    try {
        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return res.json({ success: false, message: 'Course not found.' });
        }

        const user = await User.findById(userId);

        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'User has not purchased this course.' });
        }

        // Check is user already rated
        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);

        if (existingRatingIndex > -1) {
            // Update the existing rating
            course.courseRatings[existingRatingIndex].rating = rating;
        } else {
            // Add a new rating
            course.courseRatings.push({ userId, rating });
        }

        await course.save();

        return res.json({ success: true, message: 'Rating added' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};