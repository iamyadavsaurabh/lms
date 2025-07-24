import mongoose from 'mongoose'


// Define the lecture schema
// This schema includes fields for lecture title, content, duration, and order
const lectureSchema = new mongoose.Schema({
    lectureId: { type: String, required: true },
    lectureTitle: { type: String, required: true },
    lectureDuration: { type: Number, required: true },
    lectureUrl: { type: String, required: true },
    isPreviewFree: { type: Boolean, required: true },
    lectureOrder: { type: Number, required: true }
}, { _id: false });  // we wont create unique id for chapter we also have from frontend

// Define the chapter schema
// This schema includes fields for chapter title, order, and an array of lectures
const chapterSchema = new mongoose.Schema({
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    chapterContent: [lectureSchema] // Use the lecture schema here
}, { _id: false }); // we wont create unique id for chapter we also have from frontend

// Define the course schema// This schema includes fields for course title, description, thumbnail, publication status, price, discount,
const courseSchema = new mongoose.Schema({
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String},
    isPublished: { type: Boolean, required: true },
    coursePrice: { type: Number, required: true },
    discount: { type: Number, required: true, min: 0, max: 100 },
    courseContent: [chapterSchema],   // chapters data like number of lecture chapter etc
    courseRatings: [
        { userId: { type: String } , rating: { type: Number, min: 1, max: 5 } }
    ],
    educator: {type: String ,ref: 'User' ,required: true},
    enrolledStudents: [{ type: String, ref: 'User' }],  // data of enrolled students

},{ timestamps: true,minimize: false })// Adding timestamps to track creation and update times

// Create the Course model using the course schema
const Course = mongoose.model('Course', courseSchema);
// Export the Course model for use in other parts of the application
export default Course;



