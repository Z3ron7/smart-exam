import React, { useState, useEffect } from 'react';
import { FaRegCalendarMinus, FaEllipsisV } from "react-icons/fa"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, } from 'recharts';
import PieComponent from './PieComponent';
// import { Progress } from 'antd';
import VerifyUser from './VerifyUser'
import axios from 'axios';
import error from "../../assets/images/error.png"
import './dashboard.scss'



const datas = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];




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
        <div className='dash dark:bg-slate-800'>
            <div className='flex items-center justify-between'>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-4'>
            
                <div className=' dark:bg-slate-800 border-2 h-[100px] rounded-[8px] bg-white border-l-[6px] border-[#4E73DF] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
                    <FaRegCalendarMinus fontSize={28} color="" />
				</div>
                    <div>
                        <h2 className='text-[#B589DF] text-[11px] leading-[17px] px-[10px] font-bold'>Total (Exam-takers)</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px] px-[10px] dark:text-white'>{totalStudents}</h1>
                    </div>

                </div>
                <div className='dark:bg-slate-800 border-2 h-[100px] rounded-[8px] bg-white border-l-[6px] border-[#1CC88A] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
                    <FaRegCalendarMinus fontSize={28} color="" />
				</div>
                    <div>
                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] px-[10px] font-bold'>
                            Graduating (Students)</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] px-[10px] mt-[5px] dark:text-white'>{graduatingStudents}</h1>
                    </div>
                </div>
                <div className='dark:bg-slate-800 border-2 h-[100px] rounded-[8px] bg-white border-l-[6px] border-[#36B9CC] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
                    <FaRegCalendarMinus fontSize={28} color="" />
				</div>
                    <div>
                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] px-[10px] font-bold'>ALUMNI </h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] px-[10px] mt-[5px] dark:text-white'>{alumni}</h1>
                    </div>
                </div>
                <div className='dark:bg-slate-800 border-2 h-[100px] rounded-[8px] bg-white border-l-[6px] border-[#F6C23E] flex items-center px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
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
            <div className='basis-[54%] border-2 border-indigo-700 bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-slate-800 mb-4 md:mb-0 lg:mb-0 lg:mr-4'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-darkBlue-900 border-[#EDEDED] mb-[20px]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold '>Students task chart</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>

                    <div className="lineChart">
                        {/* <canvas id="myAreaChart"></canvas> */}
                        {/* <Line options={options} data={data} /> */}
                        <ResponsiveContainer width="99%" height="100%">
                        <LineChart
                            data={datas}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                        </LineChart>
                        </ResponsiveContainer>
                    </div>

                </div>
                <div className='basis-[43%] w-96 border-2 border-indigo-700 bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-slate-800'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-darkBlue-900 border-[#EDEDED]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Categories</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>
                    <div className='pl-[35px] dark:text-white'>

                        <PieComponent />

                        {

                        }
                    </div>
                </div>
            </div>
            <div className='flex flex-col md:flex-row lg:flex-row md:gap-6 lg:gap-6 mt-[22px] w-full'>
            <div className='basis-[55%] border-2 border-indigo-700 bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-slate-800 mb-4 md:mb-0 lg:mb-0 lg:mr-4'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-darkBlue-900 border-[#EDEDED]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Pending Students</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>
                    
                    <VerifyUser />

                </div>
                <div className='basis-[44%] border-2 border-indigo-700 bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-slate-800'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-darkBlue-900 border-[#EDEDED]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'> Task</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>
                    <div className='pl-[35px] flex items-center justify-center h-[100%]'>
                        <div>
                            <img src={error} alt="" className='scale-[135%]' />
                            <p className='mt-[15px] text-semibold text-gray-500'>No data available</p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Dashboard   