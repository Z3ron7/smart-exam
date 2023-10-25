import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegCalendarMinus, FaEllipsisV } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';

// Define a function to get text color based on competency level
function getColorForLevel(level) {
  switch (level) {
    case 'Excellent':
      return 'text-green-500';
    case 'Average':
      return 'text-blue-500';
    case 'Good':
      return 'text-yellow-500';
    case 'Poor':
      return 'text-orange-500';
    case 'Very Poor':
      return 'text-red-500';
    default:
      return 'text-black';
  }
}

const Analytics = () => {
  const [examScores, setExamScores] = useState([]);
  const handlePrint = () => {
    window.print(); // This will trigger the browser's print dialog.
  };
  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    const content = document.getElementById('printable-content');

    pdf.addHTML(content, () => {
      pdf.save('analytics.pdf'); // This will trigger the download of the PDF.
    });
  };
  useEffect(() => {
    const user_id = localStorage.getItem('user_id');

    const fetchExamScores = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/exams/fetch-user-exams?userId=${user_id}&limit=2`);
        setExamScores(response.data.userExams);
      } catch (error) {
        console.error('Error fetching exam scores:', error);
      }
    };

    fetchExamScores();
  }, []);

  // Define a mapping of competency IDs to competency names
  const competencyMap = {
    '1': 'SWWPS',
    '2': 'Casework',
    '3': 'HBSE',
    // Add more mappings as needed
  };

  const processExamScores = () => {
    return examScores.map((exam, index) => {
        const { score, duration_minutes, end_time, total_duration_minutes } = exam;
        const endDate = new Date(end_time);
        const endDateFormatted = endDate.toISOString().split('T')[0];
      // Initialize an array to store the mapped competency names and scores
      const mappedScores = [];

      // Initialize an object to store the counts and percentages
      const competencyCounts = {};

      // Check if score is available before parsing it
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
        <div key={index} className="w-1/2 p-4">
            <div className='basis-[50%] border bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-slate-900 mb-4 h-4/6 lg:mb-3'>
          <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-slate-900 border-[#EDEDED] mb-[20px]'>
            <h2 className='text-[16px] leading-[19px] font-bold text-[#4e73df]'>Exam Result</h2>
            <FaEllipsisV color='gray' className='cursor-pointer' />
          </div>

          <div className='lineChart '>
            <ResponsiveContainer width='100%' height={400}>
              <LineChart
                data={competenciesForChart}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='competency' />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='score' stroke='#8884d8' activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          </div>
          <div className='bg-gray-200 p-2 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold'>Exam Details</h2>
            <p>Duration (Minutes): {duration_minutes}</p>
            <p>Date: {endDateFormatted}</p>
          <p>Exam taken (Minutes): {total_duration_minutes}</p>
            <ul>
              {mappedScores.map((item, index) => (
                <li key={index}>
                  {item.competency}: {item.score} out of {item.totalPossibleScore}{' '}
                  {parseFloat((item.score / item.totalPossibleScore * 100).toFixed(2))}%
                  {item.level && (
                    <span className={`${getColorForLevel(item.level)}`}>
                      {' '}
                      (You've got {item.level} result in {item.competency})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    });
  };

  return (
    <div className='dash'>
      <div className='flex items-center justify-between'>
        <h1 className='text-[28px] leading-[34px] font-normal text-[#5a5c69] cursor-pointer dark:text-white'>Analytics</h1>
      
        <div className='m-2'>
            <button className='items-end text-base' onClick={handleDownloadPDF}>Download as PDF</button>
            <button className='items-end text-base' onClick={handlePrint}>Print</button>
            </div>
      </div>

      <div className='mt-[10px] w-full flex flex-wrap'>
        {processExamScores()}
      </div>
    </div>
  );
};

export default Analytics;
