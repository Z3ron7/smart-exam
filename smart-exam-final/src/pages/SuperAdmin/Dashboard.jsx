import React, { useState, useEffect } from 'react';
import { FaRegCalendarMinus, FaEllipsisV } from "react-icons/fa"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, } from 'recharts';
import PieComponent from './PieComponent';
// import { Progress } from 'antd';
import VerifyUser from './VerifyUser'
import Rankings from './Rankings'
import axios from 'axios';
import error from "../../assets/images/error.png"
import './dashboard.scss'




const Dashboard = () => {

    const [totalStudents, setTotalStudents] = useState(0);
    const [graduatingStudents, setGraduatingStudents] = useState(0);
    const [alumni, setAlumni] = useState(0);
    const [pendingRequests, setPendingRequests] = useState(0);
  
    useEffect(() => {
      // Fetch the counts from your backend
      axios.get('http://localhost:3001/users/user-stats') // Adjust the URL accordingly
        .then((response) => {
          setTotalStudents(response.data.totalStudentsVerified + response.data.totalAlumniVerified);
          setGraduatingStudents(response.data.totalStudentsVerified);
          setAlumni(response.data.totalAlumniVerified);
          setPendingRequests(response.data.totalStudentsNotVerified + response.data.totalAlumniNotVerified);
        })
        .catch((error) => {
          console.error('Error fetching user statistics:', error);
        });
    }, []);

    return (
        <div className='dash'>
            <div className='flex items-center justify-between'>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-4'>
            
                <div className=' dark:bg-slate-900 border-2 h-[100px] rounded-[8px] bg-white border-l-[6px] border-[#4E73DF] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
                    <FaRegCalendarMinus fontSize={28} color="" />
				</div>
                    <div>
                        <h2 className='text-[#B589DF] text-[11px] leading-[17px] px-[10px] font-bold'>Total (Exam-takers)</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px] px-[10px] dark:text-white'>{totalStudents}</h1>
                    </div>

                </div>
                <div className='dark:bg-slate-900 border-2 h-[100px] rounded-[8px] bg-white border-l-[6px] border-[#1CC88A] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
                    <FaRegCalendarMinus fontSize={28} color="" />
				</div>
                    <div>
                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] px-[10px] font-bold'>
                            Students</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] px-[10px] mt-[5px] dark:text-white'>{graduatingStudents}</h1>
                    </div>
                </div>
                <div className='dark:bg-slate-900 border-2 h-[100px] rounded-[8px] bg-white border-l-[6px] border-[#36B9CC] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
                    <FaRegCalendarMinus fontSize={28} color="" />
				</div>
                    <div>
                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] px-[10px] font-bold'>ALUMNI </h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] px-[10px] mt-[5px] dark:text-white'>{alumni}</h1>
                    </div>
                </div>
                <div className='dark:bg-slate-900 border-2 h-[100px] rounded-[8px] bg-white border-l-[6px] border-[#F6C23E] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
                    <FaRegCalendarMinus fontSize={28} color="" />
				</div>
                    <div>
                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] px-[10px] font-bold'>PENDING REQUESTS</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] px-[10px] mt-[5px] dark:text-white'>{pendingRequests}</h1>
                    </div>
                </div>

            </div>
            <div className='flex flex-col md:flex-row md:gap-6 mt-[16px] w-full'>
            <div className='basis-[54%] border-2 border-slate-700 bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-slate-900 mb-4 md:mb-0 lg:mb-0 lg:mr-4'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-slate-900 border-[#EDEDED] mb-[20px]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold '>Pending Request</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>

                    <VerifyUser />

                </div>
                <div className='basis-[43%] w-96 border-2 border-slate-700 bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-slate-900'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-slate-900 border-[#EDEDED]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Recent Exam Rankings</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>
                    <div className=' dark:text-white'>

                       <Rankings />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard   