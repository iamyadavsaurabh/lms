import { createContext, useState, useEffect } from "react";
import { dummyCourses } from '../assets/assets';
import humanizeDuration from 'humanize-duration';
import { useAuth,useUser } from "@clerk/clerk-react";



export const AppContext = createContext();

export const AppContextProvider = ({ children, navigate }) => {

    // This is the currency that will be used in the application
    const currency = import.meta.env.VITE_CURRENCY || "$"

    // to test  api endpoints we need authentication token
    // This state is used to store the authentication token
    const {getToken} = useAuth()
    const {user} = useUser()

    // This state is used to store all the courses available in the application
    const [allCourses, setAllCourses] = useState([])

    // This state is used to check if the user is an educator or not
    const [isEducator, setisEducator] = useState([])

    // This state is used to store the courses that the user has enrolled in
    const [enrolledCourses, setEnrolledCourses] = useState([])


    // function to fetch all courses
     
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
    }


    //   function to calculate average rating of course
    //   This function takes a course object and calculates the average rating based on the ratings provided in the courseRatings array.
    const calculateRating = (course) => {
        if (!course.courseRatings || course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating;
        });
        return totalRating / course.courseRatings.length;
    };

    //  Function to calculate course chapter time
    //  This function takes a chapter object and calculates the total time of all lectures in that chapter.
    const calculateChapterTime = (chapter) => {
        let time=0
         
        chapter.chapterContent.map((lecture) => time+= lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm']});
    }

    // Function to calculate total course time
    // This function takes a course object and calculates the total duration of all lectures in the course.
    const calculateCourseDuration = (course) => {
        let time = 0;
        course.courseContent.map(chapter => 
           chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        )
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm']})
    }

    // function to calculate total No of lectures in the course
    // This function takes a course object and calculates the total number of lectures in all chapters of the course.
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        })
        return totalLectures;
    }

    const fetchUserEnrolledCourses = async () => {
        // This function would typically fetch the enrolled courses from an API or database
        // For now, we will use dummy data
        setEnrolledCourses(dummyCourses);
    }

   
    // useEffect to fetch all courses when the component mounts
    useEffect(() => {
        fetchAllCourses();
        fetchUserEnrolledCourses();
    }, [])


    const logToken = async () => {
        console.log(await getToken());  // This will log the authentication token to the console
    }
    // useEffect to check if the user is an educator or not
    useEffect(() => {
        if (user) {
            logToken()
        }
    }, [user])


    // value to be passed to the context
    const value = {
        currency,allCourses,navigate,calculateRating,
        isEducator,setisEducator,calculateNoOfLectures,
        calculateChapterTime,calculateCourseDuration,
        enrolledCourses,setEnrolledCourses,fetchUserEnrolledCourses
    }


    return (
        <AppContext.Provider value={value}>
        {children}
        </AppContext.Provider>
    );
};
