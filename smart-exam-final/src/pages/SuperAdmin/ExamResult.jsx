import React, { useEffect, useState } from "react";
import { FaEllipsisV } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import AccordionLayout from '../../components/accordion/AccordionLayout'

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

export default function ExamResult() {
  const [examScores, setExamScores] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleOpen = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Close the accordion if it's already open
    } else {
      setActiveIndex(index); // Open the clicked accordion
    }
  };

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');

    const fetchExamScores = async () => {
      try {
        const response = await axios.get('http://localhost:3001/dashboard/fetch-exam-room');
        setExamScores(response.data);
        console.log(response.data)
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
  '4': 'CO',
  '5': 'Groupwork',
  // Add more mappings as needed
};

  const processExamScores = (exam, index, activeIndex) => {
    const { room_name, description, score, duration_minutes, end_time, total_duration_minutes } = exam;
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

      const competenciesForChart = mappedScores.filter((item) => item.competency !== 'All Competency');

      return (
        <div className="flex flex-col sm:flex-row justify-center">
          <div className=' max-w-lg sm:w-1/2 lg:w-1/2 md:w-1/2 border mx-2 bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-slate-900 mb-4 h-4/6 lg:mb-3'>
            <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-slate-900 border-[#EDEDED]'>
              <h2 className='text-[16px] leading-[19px] font-bold text-[#4e73df]'> Result</h2>
              <FaEllipsisV color='gray' className='cursor-pointer' />
            </div>
            <div className='lineChart'>
              <ResponsiveContainer height={300}>
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
          <div className='bg-gray-200 dark:bg-slate-900 p-2 rounded-lg h-[350px] w- shadow-md'>
            <h2 className='text-xl font-semibold'>Exam Details</h2>
            <p>Exam Name: {room_name}</p>
            <p>Description: {description}</p>
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
    }
  };
  
  const competencyName = {
    4: 'All Competency',
    1: 'SWWPS',
    2: 'Casework',
    3: 'HBSE',
    5: 'CO',
    6: 'Groupwork',
  };
  
  return (
    <div className="dash flex dark:text-white">
      <div className="flex items-center justify-between">
      </div>
      <div className="mt-[10px] w-full justify-center">
        <div className="flex bg-gray-200 dark:bg-slate-900 p-2 gap-2 mb-4 rounded-lg shadow-md">
          <div className="sm:w-14 lg:w-28 lg:font-semibold md:text-sm text-sm">Name</div>
          <div className="sm:w-20 lg:w-28 lg:pl-14 lg:font-semibold md:text-sm text-sm">Avatar</div>
          <div className="w-1/4 text-sm md:text-sm lg:pl-16 lg:font-semibold">Room Name</div>
          <div className="pl-1 w-1/5 text-sm md:text-sm lg:font-semibold">Competency ID</div>
          <div className="pl-1 w-1/5 text-sm md:text-sm lg:font-semibold">Score</div>
          <div className="pl-1 w-1/5 text-sm md:text-sm lg:font-semibold">Total Duration</div>
          <div className="w-1/6 text-sm md:text-sm lg:font-semibold">Action</div>
        </div>
        {examScores.map((exam, index) => {
  // Initialize an array to store the mapped scores for each competency
  const mappedScores = [];
  
  // Initialize an object to store the counts and percentages
  const competencyCounts = {};

  // Check if the exam has a score
  if (exam.score) {
    const scoreString = exam.score;
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
    
    return (
      <AccordionLayout 
        title={(
          <div className="flex flex-row items-center justify-center gap-4 sm:gap-10 lg:gap-5 dark:text-white mx-3">
            <div className="w-12 text-xs lg:text-base lg:w-16 ">{exam.name}</div>
            <div className="w-36 text-xs lg:text-base lg:w-16 lg:ml-12"><img
          src={exam.image}
          alt=""
          className="rounded-full w-10 h-10"
        /></div>
            <div className="w-12 text-xs lg:text-base lg:w-16 lg:pl-12 ">{exam.room_name}</div>
            <div className="w-28 text-xs lg:text-base lg:w-40 lg:pl-28">{competencyName[exam.competency_id]}</div>
            <div className="pl-3 text-xs lg:text-base w-1/6 lg:w-28 lg:pl-24">
              <ul>
                  <li>
                    {mappedScores[0].score}
                  </li>
              </ul>
            </div>
            <div className="w-28 text-xs lg:text-base lg:w-28 sm:pl-10 lg:pl-32">{exam.total_duration_minutes}</div>
          </div>
        )}
        index={index}
        activeIndex={activeIndex}
        setActiveIndex={handleOpen}
        key={index}
      >
        {processExamScores(exam)}
      </AccordionLayout>
    );
  }
  // Return null or handle the case where there's no score
  return null;
})}
      </div>
    </div>
  );
}
