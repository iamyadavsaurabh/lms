import React from 'react'
import { useState,useEffect,useContext } from 'react'
import { AppContext } from '../../context/AppContext' 
import { dummyDashboardData } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'

const Dashboard = () => { 

  const [dashboardData,setDashboardData]=useState(null);

  // for currency
  const {currency}=useContext(AppContext);

   
  //  This function is likely used to retrieve educator dashboard data from a server
  const fetchDashboardData=async()=>{ 
    setDashboardData(dummyDashboardData);
  }

  // for execute this function
  useEffect(() => {
    fetchDashboardData() 
  }, [])
  

    
//  if dashboardData is not null then return dashboard data else loading 
  return dashboardData ? (
    <div className='min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      
      <div className='space-y-5'>

        {/* for row */}
        <div className='flex flex-wrap gap-5 items-center'>

          {/* for number of enroolement */}
          <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
            <img src={assets.patients_icon} alt="patients icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'>{dashboardData.enrolledStudentsData.length}</p>
              <p className='text-base text-gray-500'>Total Enrolments</p>
            </div>
          </div>

          {/* for courses */}
          <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
            <img src={assets.appointments_icon} alt="patients icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'>{dashboardData.totalCourses}</p>
              <p className='text-base text-gray-500'>Total Courses</p>
            </div>
          </div>

          {/* for earning */}
          <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
            <img src={assets.earning_icon} alt="patients icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'>{currency}{dashboardData.totalEarnings}</p>
              <p className='text-base text-gray-500'>Total Earnings</p>
            </div>
          </div>

        </div>   

        {/*for new enrooled students data */}
        <h2 className='pb-4 text-lg font-medium '>Latest Enrolments</h2>
        <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
        {/* shows data in table */}
          <table className='table-fixed md:table-auto w-full overflow-hidden'>
            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
              <tr>
                <th className='px-4 py-3 font semibold text-center hidden sm:table-cell'>#</th>
                <th className='px-4 py-3 font-semibold'>Student Name</th>
                <th className='px-4 py-3 font-semibold'>Course Title</th>
              </tr>
            </thead> 

            <tbody className='text-sm text-gray-500'>
              {dashboardData.enrolledStudentsData.map((item,index)=>(
                <tr key={index} className='border-b border-gray-500/20'>
                  <td className='px-4 py-3 text-center hidden sm:table-cell'>{index+1}</td>
                  <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                    <img src={item.student.imageUrl} alt="" className='w-9 h-9 rounded-full' />
                    <span className='truncat'>{item.student.name}</span>
                  </td>
                  <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
                </tr>
              ))}

            </tbody>

          </table>
          
        </div>

      </div>

    </div>
  )  : <Loading />
}

export default Dashboard
