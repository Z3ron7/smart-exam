import React from 'react'
import { FaRegCalendarMinus, FaEllipsisV } from "react-icons/fa"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, } from 'recharts';
import PieComponent from './StudentPie';
// import { Progress } from 'antd';
import error from "../../assets/images/error.png"
import './studentDashboard.scss'



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




const StudentDashboard = () => {



    return (
        <div className='dash'>
            <div className='flex items-center justify-between'>
                <h1 className='text-[28px] leading-[34px] font-normal text-[#5a5c69] cursor-pointer dark:text-white'>Dashboard</h1>
            </div>
            
            <div className='flex flex-col md:flex-row md:gap-6 mt-[22px] w-full'>
            <div className='basis-[60%] border bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-slate-900 mb-4 md:w-80 h-4/5 lg:mb-0 lg:mr-4'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-slate-900 border-[#EDEDED] mb-[20px]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold '>Students task chart</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>

                    <div className="lineChart">
                        {/* <canvas id="myAreaChart"></canvas> */}
                        {/* <Line options={options} data={data} /> */}
                        <ResponsiveContainer width="100%" height={400}>
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
                <div className='basis-[30%] border bg-white shadow-md cursor-pointer rounded-[4px] h-4/5 dark:bg-slate-900'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-slate-900 border-[#EDEDED]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Categories</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>
                    <div className='w-full h-4/5 dark:text-white'>

                        <PieComponent />

                        {

                        }
                    </div>
                </div>
            </div>
            <div className='flex flex-col md:flex-row lg:flex-row md:gap-6 lg:gap-6 mt-[22px] w-full'>
            <div className='basis-[55%] border bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-slate-900 mb-4 md:mb-0 lg:mb-0 lg:mr-4'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-slate-900 border-[#EDEDED]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Pending Students</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>
                    {/* <div className='px-[25px] space-y-[15px] py-[15px]'>
                        <div>
                            <h2>Server Migration</h2>
                            <Progress percent={30} strokeColor="#E74A3B" />
                        </div>
                        <div>
                            <h2>Sales Tracking</h2>
                            <Progress percent={50} status="active" strokeColor="#F6C23E" />
                        </div>
                        <div>
                            <h2>Customer Database</h2>
                            <Progress percent={70} status="active" strokeColor="#4E73DF" />
                        </div>
                        <div>
                            <h2>Payout Details</h2>
                            <Progress percent={100} strokeColor="#36B9CC" />
                        </div>
                        <div>
                            <h2>Account Setup</h2>
                            <Progress percent={50} status="exception" strokeColor="#1CC88A" />
                        </div>
                    </div> */}





                </div>
                <div className='basis-[45%] border bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-slate-900'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-slate-900 border-[#EDEDED]'>
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

export default StudentDashboard   