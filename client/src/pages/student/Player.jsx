import React from 'react'
import { useContext, useState,useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration'; // for formatting time duration
import Youtube from 'react-youtube'; // for displaying YouTube videos
import Footer from '../../components/student/Footer'; // Footer component for the page
import Rating from '../../components/student/Rating'; // Rating component for course rating


const Player = () => {

  // Accessing the context to get enrolled courses and calculate chapter time
  // This will allow us to display the course structure and calculate time for each chapter
  const {enrolledCourses, calculateChapterTime} = useContext(AppContext);

  // useParams will give us the courseId from the URL
  // This will be used to fetch the course data from enrolled courses
  const {courseId} = useParams();

  // courseData will hold the data of the course to be displayed
  // This will be used to display the course structure and lectures
  const [courseData, setCourseData] = useState(null);

  // openSections will hold the state of which sections are open in the course structure
  // this will be used to toggle the visibility of lectures in each chapter
  const [openSections, setOpenSections] = useState({});

  // playerData will hold the data of the lecture to be played
  // this will be used to display the video player and lecture details
  const [playerData, setPlayerData] = useState(null) ;


  // function to get course data from enrolled courses based on courseId
  // this will be used to display course structure and lectures
  const getCourseData = () => {
     
    enrolledCourses.map((course) =>{
      if (course._id === courseId) {
        setCourseData(course);
      }
    })
  }

  // toggle function for course structure sections open and close 
  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
      }));
  }

  // useEffect to get course data when enrolledCourses or courseId changes
  // this will ensure that the course data is fetched and displayed correctly
  useEffect(() => {
    getCourseData();
  },  [enrolledCourses, courseId]);

  return (
  <>
    <div className='p-4 sm:p-10 flex flex-col reverse md:grid  md:grid-cols-2 gap-10 md:px-36'>
      {/* {for left column} */}
        <div className='text-gray-800'>
          <h2 className='text-xl font-semibold'>Course Structure</h2>
          {/* div for course structure */}
            <div className='pt-5'>
              {/* map only when we have course data through course content */}
               
              {courseData && courseData.courseContent.map((chapter, index) => (
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
                          <img src={false ? assets.blue_tick_icon : assets.play_icon} alt="play icon" className='w-4 h-4 mt-1'/>
                          <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                            <p>{lecture.lectureTitle}</p>
                            <div className='flex gap-2'>
                              {/* preview data and add preview onclick */}
                              {lecture.lectureUrl && <p onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })} className='text-blue-500 cursor-pointer'>Watch</p>}

                              <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>

                            </div>
                          </div>
                        </li>
                      ))} 
                    </ul>
                  </div>
                </div>
              ))}
            </div>

           {/* { for raing} */}
            <div className='flex items-center gap-2 py-3 mt-10'>
              <h1 className='text-xl font-bold'>Rate This Course</h1>
              <Rating initialRating={0} />
            </div>

        </div>


      {/* {for right column} */}
        <div className='md:mt-10'>
          {playerData ? (
              <div>
                <Youtube videoId={playerData.lectureUrl.split('/').pop()} iframeClassName='w-full aspect-video' />
                <div className='flex justify-between items-center mt-1'>
                  {/*for displaying chapter, lecture and title*/}
                  <p>{playerData.chapter},{playerData.lecture},{playerData.lectureTitle}</p>
                   
                  <button className='text-blue-600'>{false ? 'Completed' : 'Mark Complete'}</button>
                </div>
              </div>
            )
            : <img src={courseData ? courseData.courseThumbnail : ''} alt="" />
          }
         
        </div>
    </div>

    {/* Footer Component */}
    <Footer/>
    
  </>
  )
}

export default Player