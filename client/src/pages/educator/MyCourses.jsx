import React from 'react'
import { useContext,useEffect,useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'


const MyCourses = () => {

  // function for getting all courses
  const {currency,allCourses} = useContext(AppContext) 

  // state varible to store courses
  const [courses, setCourses] = useState(null)

  //  function to fatch all courses
  const fetchEducatorCourses = async () => {
    setCourses(allCourses)
  }

  // to execute the function when the page loads  
  useEffect(() => {
    fetchEducatorCourses()
  },[])

  // when we have course data we show it otherwise loading
  return courses ? (
    <div className='h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='w-full'>
        <h2 className='pb-4 text-lg font-medium '>My Course</h2>
        {/* display table */}
        <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
          <table className='md:table-auto w-full table-fixed overflow-hidden' >

            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
              <tr>
                <th className='px-4 py-3 font-semibold truncate'>All Courses</th>
                <th className='px-4 py-3 font-semibold truncate'>Earnings</th>
                <th className='px-4 py-3 font-semibold truncate'>Students</th>
                <th className='px-4 py-3 font-semibold truncate'>Published On</th>
              </tr>
            </thead>

            {/* table body in which shwo course data*/}
            <tbody className='text-sm text-gray-500'>
              {courses.map((course) => (
                <tr key={course._id} className='border-b border-gray-500/20'>
                  <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate'>
                    <img src={course.courseThumbnail} className='w-16' alt="course image" />
                    <span className='truncate hidden md:block'>{course.courseTitle}</span>
                  </td>
                  {/* for eraning */}
                  <td className='px-4 py-3'>
                    {currency}{ Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))}
                  </td>
                  {/* for students */}
                  <td className='px-4 py-3'>
                    {course.enrolledStudents.length}
                  </td>
                  {/* for published on */}
                  <td className='px-4 py-3'>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default MyCourses