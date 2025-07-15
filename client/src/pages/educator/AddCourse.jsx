import React,{useRef, useState, useEffect} from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import { assets } from '../../assets/assets'




const AddCourse = () => {

  // for Quill editor for contenteditable area
  const quillRef = useRef(null)

  // for Quill editor for title editable area
  const editorRef = useRef(null)

  // for store all the things related to course create state veriable
  const [courseTitle, setCourseTitle] = useState('') 
  // for store all the things related to course create state veriable
  const [coursePrice, setCoursePrice] = useState(0) 
  const [discount, setDiscount] = useState(0) 
  const [image, setImage] = useState(null) 
  const [chapters, setChapters] = useState([]) 
  const [courseThumbnail, setCourseThumbnail] = useState('');
  // for popup during lecture creation
  const [showpopup, setShowPopup] = useState(false)
  // for chapter id
  const [currentChapterId, setCurrentChapterId] = useState(null)

  // for lecture details for each chapter
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl:'',
    isPreviewFree:false,
  })

  // handle chapter for add function in add chapter button and add chapter
  const handleChapter = (action,chapterId) => {
    if(action === 'add'){
      const title = prompt('Enter Chapter Name:');
      if(title){
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder : chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        }
        setChapters([...chapters, newChapter])     
      }
    }
    else if(action === 'remove'){
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId))
    }
    else if(action === 'toggle'){
      setChapters(chapters.map((chapter) => {
        if(chapter.chapterId === chapterId){
          return {...chapter, collapsed: !chapter.collapsed}
        }
        else{
          return chapter
        }     
      }))
    }  
  }

  // function to add lecture and give functionality to lecture button inside add chapter
  const handleLecture = (action,chapterId,lectureIndex) => {
    if(action=== 'add'){
      setCurrentChapterId(chapterId)
      setShowPopup(true)
    }
    else if(action === 'remove'){
      setChapters(
        chapters.map((chapter) => {
          if(chapter.chapterId === chapterId){
            chapter.chapterContent.splice(lectureIndex,1)
            return chapter
          }
          else{
            return chapter
          }
        })
      )
    }
  }

  // fucntion for functionining add button in final lecutre deatils addition
  const addLecture = ()=>{
      setChapters(
        chapters.map((chapter) => {
          if(chapter.chapterId === currentChapterId){
            const newLecture = {
              ...lectureDetails,
              lectureOrder : chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            }
            chapter.chapterContent.push(newLecture)
            return chapter
          }
          else{
            return chapter
          }        
      }))
      setShowPopup(false)
      // after submit reset the detilas
      setLectureDetails({
        lectureTitle: '',
        lectureDuration: '',
        lectureUrl:'',
        isPreviewFree:false,
      })
  }

  // for final submit of form
  const handleSubmit = async(e) => {
    e.preventDefault()
  }
           

 // for Quill editor for contenteditable area
  useEffect(()=>{
    // intiate quill only once
    if(!quillRef.current && editorRef.current){
      quillRef.current=new Quill(editorRef.current,
        {
          theme : 'snow',
        })
    }
  },[])


  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-md w-full text-gray-500'>
        
        <div className='flex flex-col gap-1'>
          <p>Course Title</p>
          <input onChange={ e => setCourseTitle(e.target.value)} value={courseTitle} type="text" placeholder='Type here' className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' required/>
        </div>

        {/* another div for edit and format the text */}
        <div className='flex flex-col gap-1'> 
          <p>Course Description</p>
          <div ref={editorRef} className='border border-gray-500 rounded'></div>
        </div>
        
        {/* add div in which add two cloumn one for input field for course price and another for course thmbnail*/}
        <div className='flex flex-wrap items-center justify-between'>
          {/* for price input */}
          <div className='flex flex-col gap-1'>
              <p>Course Price</p>
              <input onChange={ e => setCoursePrice(e.target.value)} value={coursePrice} type="number" placeholder='0' className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' required/>
          </div>
          {/* for tumbnail input */}
          <div className='flex md:flex-row flex-col items-center gap-3'>
              <p>Course Thumbnail</p>
              <label htmlFor="thumbnailImage" className='flex items-center gap-3'>
                <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded' />
                <input onChange={ e => setCourseThumbnail(e.target.files[0])} type="file" id='thumbnailImage' accept='image/*' hidden/>
              </label>
          </div>
        </div>

        {/* div for discount */}
        <div className='flex flex-col gap-1'>
          <p>Discount %</p>
          <input onChange={ e => setDiscount(e.target.value)} value={discount} type="number" placeholder='0' min={0} max={100} className='outline-none md:py-2.5 py-2 px-3 w-28 rounded border border-gray-500' required/>
        </div>

        {/* adding chapters and lectures */}
        <div>
          {chapters.map((chapter,chapterIndex) => (
              <div key={chapterIndex} className='bg-white border rounded-lg mb-4'>
                <div className='flex justify-between items-center p-4 border-b'>
                  <div className='flex items-center'>

                    <img src={assets.dropdown_icon} onClick={() => handleChapter('toggle',chapter.chapterId)} width={14} alt="" className={'mr-2 cursor-pointer transition-all $ {chapter.collapsed ? "-rotate-90" }'}/>
                    <span className='font-semibold'>{chapterIndex + 1} {chapter.chapterTitle}</span>
                  
                  </div>
                  {/* for total number of lecture avilable */}
                  <span className='text-gray-500'>{chapter.chapterContent.length} Lectures</span>
                  {/* add cross icon which remove the chapters */}
                  <img src={assets.cross_icon} onClick={() => handleChapter('remove',chapter.chapterId)} alt="" className='cursor-pointer' />

                </div>

                {!chapter.collapsed && (
                  <div className='p-4'>
                    {chapter.chapterContent.map((lecture, lectureIndex) => (
                      <div key={lectureIndex} className='flex items-center justify-between mb-2'>
                        
                        <span className='text-gray-500'>{lectureIndex + 1} {lecture.lectureTitle} - {lecture.lectureDuration} mins - 
                          <a href={lecture.lectureUrl} target='_blank' className='text-blue-500'>Link</a>
                          -{lecture.isPreviewFree ? "Free Preview" : "Paid"}     
                        </span>
                        {/* add cross icon which remove the lecture */}
                        <img src={assets.cross_icon} onClick={() => handleLecture('remove',chapter.chapterId,lectureIndex)} alt="" className='cursor-pointer' />

                      </div>
                    ))}

                    {/* add lecture */}
                    <div onClick={() => handleLecture('add',chapter.chapterId)} className='inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2'>
                      + Add Lecture
                    </div>

                  </div>
                )}
              </div>
          ))}
          {/* button which add chapter */} 

          {/* for functionality in add chapter button we use handle chapter function */}
          <div  onClick={() => handleChapter('add')} className='flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer '>+ Add Chapter</div>
          {/* whenever showpopup is true it show lecture deatils */}
          {showpopup && (
            <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
              <div className='bg-white text-gray-700 p-4 rounded relative w-full max-w-80'>
                <h2 className='text-lg font-semibold mb-4'>Add Lecture</h2>

                <div className='mb-2'>
                  <p>Lecture Title</p>
                  <input type="text" className='mt-1 block w-full border rounded py-1 px-2' value={lectureDetails.lectureTitle} onChange={(e) => setLectureDetails({...lectureDetails, lectureTitle: e.target.value})}/>
                </div>

                <div className='mb-2'>
                  <p>Duration (minutes)</p>
                  <input type="text" className='mt-1 block w-full border rounded py-1 px-2' value={lectureDetails.lectureDuration} onChange={(e) => setLectureDetails({...lectureDetails, lectureDuration: e.target.value})}/>
                </div>

                <div className='mb-2'>
                  <p>Lecture URL</p>
                  <input type="text" className='mt-1 block w-full border rounded py-1 px-2' value={lectureDetails.lectureUrl} onChange={(e) => setLectureDetails({...lectureDetails, lectureUrl: e.target.value})}/>
                </div>

                <div className='mb-2'>
                  <p>Is Preview Free?</p>
                  <input type="checkbox" value={lectureDetails.isPreviewFree}  checked={lectureDetails.isPreviewFree} onChange={(e) => setLectureDetails({...lectureDetails, isPreviewFree: e.target.checked})} className='mt-1 scale-125'/>
                </div>

                <button onClick={addLecture} type='button' className='w-full bg-blue-400 text-white px-4 py-2 rounded'>Add</button>

                {/* adding image with that float pop up  and remove lecture*/}
                <img src={assets.cross_icon} alt="" onClick={() => setShowPopup(false)} className='absolute top-4 right-4 w-4 cursor-pointer'/>

              </div>
            </div>
          )}

        </div>
        {/*before closing form add one button with which we can submit final form */}
        <button type='submit' className='w-max bg-black text-white py-2.5 px-8 rounded my-4'>ADD</button>


      </form>
    </div>
  )
}

export default AddCourse