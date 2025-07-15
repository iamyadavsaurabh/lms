import React from 'react'
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useState } from 'react';
import { Line } from 'rc-progress';
import Footer from '../../components/student/Footer';



 
const MyEnrollments = () => {

  // Accessing the context to get enrolled courses
  // This will allow us to display the courses the user is enrolled in.
  const { enrolledCourses,calculateCourseDuration,navigate } = useContext(AppContext);
  
  // State to hold the progress of each course
   
   
  const [progressArray, setProgressArray] = useState([
    {lectureCompleted:5, totalLectures:10},
    {lectureCompleted:0, totalLectures:10},
    {lectureCompleted:2, totalLectures:10},
    {lectureCompleted:6, totalLectures:10},
    {lectureCompleted:2, totalLectures:10},
    {lectureCompleted:10, totalLectures:10},
    {lectureCompleted:8, totalLectures:10},
    {lectureCompleted:9, totalLectures:10},
  ]);
  
  return (
    <>
      <div className='md:px-36 py-8 pt-10'>
        <h1 className='text-2xl font-semibold'>My Enrollments</h1>

        <table className='md:table-auto table-fixed w-full mt-10 overflow-hidden border'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
            <tr>
              <th className='px-4 py-3 font-semibold truncate'>Course</th>
              <th className='px-4 py-3 font-semibold truncate'>Duration</th>
              <th className='px-4 py-3 font-semibold truncate'>Completed</th>
              <th className='px-4 py-3 font-semibold truncate'>Status</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {enrolledCourses.map((course,index) => (
              <tr key={index} className='border-b border-gray-500/20'>

                {/* for course title and thumbnail */}        
                <td className='flex items-center space-x-3 md:px-4 pl-2 md:pl-4 py-3'>

                  {/* Course Thumbnail */}
                  <img src={course.courseThumbnail} alt="" className='w-14 sm:w-24 md:w-28'/>

                  {/* Course Title */}
                  <div className='flex-1'>
                    <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                    <Line percent={(progressArray[index]?.lectureCompleted / progressArray[index]?.totalLectures) * 100} strokeWidth={2} trailWidth={2} strokeColor="#3b82f6" />
                  </div>

                </td>

                {/* for duration */}
                <td className='px-4 py-3 max-sm:hidden'>
                  {calculateCourseDuration(course)}
                </td>

                {/* for completed lectures */}
                <td className='px-4 py-3 max-sm:hidden'>
                  {/* progress bar */}
                   
                  {progressArray[index] && `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`} 
                  <span> Lectures</span>
                </td>

                {/* for status */}  
                <td className='px-4 py-3 max-sm:text-right'>
                  <button className='px-3 sm:px-5 py-1.5 sm:py-2 rounded bg-blue-600 max-sm:text-xs text-white' onClick={() => navigate(`/player/${course._id}`)}>
                    { // Displaying the status based on the progress of the course
                      progressArray[index] && (progressArray[index].lectureCompleted === progressArray[index].totalLectures ? 'Completed' : 'On-going')
                    }
                  </button>
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {/* Footer Component */}
      <Footer/>

    </>
  )
}

export default MyEnrollments