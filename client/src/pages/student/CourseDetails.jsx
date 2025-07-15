import React from 'react'
import { useParams } from 'react-router-dom';
import { useContext, useState,useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration'; 
import Footer from '../../components/student/Footer';
import Youtube from 'react-youtube';


const CourseDetails = () => {

  const { id } = useParams();

  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData] = useState(null)

  const {allCourses,calculateRating,calculateNoOfLectures,
        calculateChapterTime,calculateCourseDuration,currency} = useContext(AppContext)


  const fetchCourseData = async () => {
     
     
     
    const findCourse = allCourses.find(course => String(course._id) === String(id));
      setCourseData(findCourse);
  }

  useEffect(() => {
    fetchCourseData()
  }, [allCourses, id]);

  // toggle function for course structure sections open and close 
  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
      }));
  }

   
  return courseData ? (
    <>
    <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>
        <div className='absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70'/>
        
        {/* left column */}
        <div className='max-w-xl z-10 text-gray-500'>
          <h1 className='md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800'>{courseData.courseTitle}</h1>
          <p  className='pt-4 md:text-base text-sm'  dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}></p>
          
          {/* {review and ratings} */}
          <div className='flex items-center space-x-2 pt-3 pb-1 text:sm'>
            <p>{calculateRating(courseData)}</p>
            <div className='flex'>
              {[...Array(5)].map((_,i)=>(<img key={i} src={i< Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt='' className='w-3.5 h-3.5' />))}
            </div>
            <p className='text-gray-500'>({courseData.courseRatings.length} {courseData.courseRatings.length >1 ? 'Ratings' : 'Rating'})</p>
            <p className='text-blue-600'>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length >1 ? 'Students' : 'Student'}</p>
          </div>

          <p className='text-sm'>Course by <span className='text-blue-600 underline'>GreatStack</span></p>

          <div className='pt-8 text-gray-800'>
            <h2 className='text-xl font-semibold'>Course Structure</h2>
            {/* div for course structure */}
            <div className='pt-5'>
              {courseData.courseContent.map((chapter, index) => (
                // chapter title and time
                <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                  <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={() => toggleSection(index)}>
                    <div className='flex items-center gap-2'>

                      <img className={`transform transition-transform duration-300 ${openSections[index] ? 'rotate-180' : 'rotate-0'}`} src={assets.down_arrow_icon} alt="arrow icon" />   {/* down icon */}
                      
                      <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>    {/* chapter title */}
                    
                    </div>
                    {/* chapter time  */}
                    <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                  </div>

                  {/* lectures in chapter */}
                  <div className={`overflow-hidden transition-all duration-300 max-h-96`} style={{ maxHeight: openSections[index] ? '1000px' : '0px' }}>
                    <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 boreder-t border-gray-300'>
                      {chapter.chapterContent.map((lecture, i)=> (
                        <li key={i} className='flex items-start gap-2 py-1'>
                          <img src={assets.play_icon} alt="play icon" className='w-4 h-4 mt-1'/>
                          <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                            <p>{lecture.lectureTitle}</p>
                            <div className='flex gap-2'>
                              {/* preview data and add preview onclick */}
                              {lecture.isPreviewFree && <p onClick={() => setPlayerData({videoId: lecture.lectureUrl.split('/').pop()})} className='text-blue-500 cursor-pointer'>Preview</p>}
                              
                              <p>{humanizeDuration(lecture.lectureDuration *60*1000,{units:['h','m']})}</p>
                            
                            </div>
                          </div>
                        </li>
                      ))} 
                    </ul>
                  </div>


                </div>

              ))}
            </div>    
          </div>

          {/* div for course description */}
          <div className='py-20 text-sm md:text-default '>
            <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
            <p className='pt-3 rich-text' dangerouslySetInnerHTML={{ __html: courseData.courseDescription}}></p>
          </div>

        </div>
        
        {/* right column */}
        <div className='max-w-course-card z-10 shadow-custom rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px] '>
          
          {/* course thumbnail photo */}
          {/* if we have player data then will run video otherwise image */}
          {
            playerData ? 
              /* if we have player data then will run video */ 
              <Youtube videoId={playerData.videoId} opts={{playerVars:{autoplay: 1}}} iframeClassName='w-full aspect-video' />
              /* if we don't have player data then will show image */
            : <img src={courseData.courseThumbnail} alt="" />   

          }

            {/* time clock icon */}
          <div className='p-5'>
            <div className='flex items-center gap-2'>
              <img className='w-3.5' src={assets.time_left_clock_icon} alt="time left clock icon" />
              <p className='text-red-500'> <span className='font-medium'>5 days</span> left at this price! </p>
            </div>

            {/* {for course price} */}  
            <div className='flex gap-3 items-center pt-2'>
              <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency}{(courseData.coursePrice - courseData.discount*courseData.coursePrice / 100).toFixed(2)}</p>

              <p className='md:text-lg text-gray-500 line-through'>{currency}{courseData.coursePrice}</p>

              <p className='md:text-lg text-gray-500'>{courseData.discount}% off</p>
            </div>

            {/* total lecture,rating,time */}
            <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
              
              {/* {for star icon} */}
              <div className='flex items-center gap-1'>
                <img src={assets.star} alt="" />
                {/* course rating */}
                <p>{calculateRating(courseData)}</p>
              </div> 

              {/* {create a verticle line} */}
              <div className='w-px bg-gray-500/40 h-4'></div>

              {/* {for time} */}
              <div className='flex items-center gap-1'>
                <img src={assets.time_clock_icon} alt="clock_icon" />
                {/* course duration */}
                <p>{calculateCourseDuration(courseData)}</p>
              </div>

              {/* {create a verticle line} */}
              <div className='w-px bg-gray-500/40 h-4'></div>

              {/* {for number of lectures} */}
              <div className='flex items-center gap-1'>
                <img src={assets.lesson_icon} alt="clock icon" />
                {/* course duration */}
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>

            </div>
            {/* {end of course,rating time div} */}


            {/* {enroll button} */}
            <button className='md:mt-6 mt-4 w-full py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed'>
              {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
            </button>
            {/* {end of enroll button} */}

            {/* decription */}
            <div className='pt-6'>
              <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the course?</p>
              <ul className='ml:4 pt-2 text-sm md:text-default text-gray-500 list-disc'>
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>
            {/* end of decription */}

          </div>
        </div>

    </div>

    {/* ADD FOOTER */}
    <Footer />
    {/* end of footer */}
    </>
  ) : <Loading />// Assuming you have a Loading component to show while fetching data
}

export default CourseDetails
