import React, { useState, useEffect } from 'react';
import { FaRegCalendarMinus, FaEllipsisV } from "react-icons/fa"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, } from 'recharts';
import PieComponent from './StudentPie';
// import { Progress } from 'antd';
import error from "../../assets/images/error.png"
import './studentDashboard.scss';
import axios from 'axios';


const StudentDashboard = () => {

    const [examScores, setExamScores] = useState([]);

    useEffect(() => {
        const user_id = localStorage.getItem('user_id');
      
        const fetchExamScores = async () => {
          try {
            const response = await axios.get(`http://localhost:3001/dashboard/fetch-latest?userId=${user_id}&limit=1`);
            setExamScores(response.data.latestActivity)
      console.log('latest:', response.data.latestActivity)
      
          } catch (error) {
            console.error('Error fetching exam scores:', error);
          }
        };
      
        fetchExamScores();
      }, []);
      console.log("mappe", examScores)

      return examScores.map((exam, index) => {
        const { score, end_time} = exam;
        const endDate = new Date(end_time);
        const endDateFormatted = endDate.toISOString().split('T')[0];
              const competencyMap = {
                '1': 'SWWPS',
                '2': 'Casework',
                '3': 'HBSE',
                '4': 'CO',
                '5': 'Groupwork',
              };
      
              const mappedScores = [];
              const competencyCounts = {};
      
              if (score) {
                const scoreString = score;
        const scores = JSON.parse(scoreString);
      
                // Calculate the total score for all competencies
        let totalScore = 0;
        let totalPossibleScore = 0;

                for (const competencyId in scores) {
          if (competencyMap[competencyId]) {
            const competencyScore = scores[competencyId];
            totalScore += competencyScore;
            totalPossibleScore += 100; // Assuming the maximum score for each competency is 100
            mappedScores.push({
              competency: competencyMap[competencyId],
              score: competencyScore,
              totalPossibleScore: 100, // Each competency has a total possible score of 100
            });

            // Update competency counts
            if (!competencyCounts[competencyMap[competencyId]]) {
              competencyCounts[competencyMap[competencyId]] = {
                score: 0,
                totalPossibleScore: 0,
              };
            }
            competencyCounts[competencyMap[competencyId]].score += competencyScore;
            competencyCounts[competencyMap[competencyId]].totalPossibleScore += 100;
          }
        }
        // Calculate and add the "All Competency" entry
        const allCompetencyScore = totalScore;
        const allCompetencyPossibleScore = totalPossibleScore;
        mappedScores.push({
          competency: 'All Competency',
          score: allCompetencyScore,
          totalPossibleScore: allCompetencyPossibleScore,
        });

        // Sort the mappedScores array so that "All Competency" comes before other competencies
        // Sort the mappedScores array so that "All Competency" comes before other competencies
        mappedScores.sort((a, b) => {
            if (a.competency === 'All Competency') return -1;
            if (b.competency === 'All Competency') return 1;
            return a.competency.localeCompare(b.competency);
          });
  
          // Filter out "All Competency" from mappedScores
  
          // Define competency level criteria
          const competencyLevels = [
            { level: 'Excellent', minPercent: 90 },
            { level: 'Average', minPercent: 80 },
            { level: 'Good', minPercent: 75 },
            { level: 'Poor', minPercent: 60 },
            { level: 'Very Poor', minPercent: 0 },
          ];
  
          // Calculate and update competency levels
          mappedScores.forEach((item) => {
            const percentage = ((item.score / item.totalPossibleScore) * 100).toFixed(2); // Round to two decimal places
            for (const levelData of competencyLevels) {
              if (percentage >= levelData.minPercent) {
                item.level = levelData.level;
                break;
              }
              // Add the competency level message
              item.levelMessage = `(You've got ${item.level} result in ${item.competency})`;
            }
        });
      }
        const competenciesForChart = mappedScores.filter((item) => item.competency !== 'All Competency');
      
    return (
        <div key={index} className='dash'>
            <div className='flex flex-col md:flex-row md:gap-6 mt-[22px] w-full'>
            <div className='basis-[53%] border-2 border-slate-700 bg-white shadow-md rounded-[4px] dark:bg-slate-900 mb-4 md:w-80 h-4/5 lg:mb-0 lg:mr-4'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-slate-900 border-[#EDEDED] mb-[20px]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold '>Recent Exam chart</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>
                    <div className="lineChart">
                        {/* <canvas id="myAreaChart"></canvas> */}
                        {/* <Line options={options} data={data} /> */}
                        <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={competenciesForChart}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey='competency' />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className='basis-[43%] w-96 border-2 border-slate-700 bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-slate-900'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-slate-900 border-[#EDEDED]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Percentage of All Competency</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>
                    <div className='dark:text-white'>
                        <PieComponent />
                    </div>
                </div>
            </div>
        </div>
    )
                        })
}

export default StudentDashboard   