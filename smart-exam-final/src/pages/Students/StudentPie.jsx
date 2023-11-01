import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
const data = [
    { name: 'Group A', value: 100 },
    { name: 'Group B', value: 89 },
    { name: 'Group C', value: 68 },
    { name: 'Group D', value: 58 },
    { name: 'Group E', value: 50 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF8002'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
const StudentPie = () => {
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
                '1': 'SWPPS',
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
        <div>
        <div >
        <ResponsiveContainer width="100%" height={320}>
        <PieChart >
            <Pie
                data={competenciesForChart}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={130}
                fill="#8884d8"
                dataKey="score"
            >
                {mappedScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
        </PieChart>
        </ResponsiveContainer>
        </div>
        <div className='grid gap-2 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-5 justify-center mx-auto items-center'>
        {
          
          mappedScores
  .filter((item) => item.competency !== 'All Competency') // Exclude the "All Competency" item
  .map((item) => (
    <p className='flex cursor-pointer font-bold justify-center items-center mx-auto'>{item.competency}</p>
  ))

        }
        </div>
        <div className='grid gap-2 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-5'>
            {
                 COLORS.map((item)=>(
        <div className="flex h-[15px] w-[15px] justify-center items-center mx-auto" style={{backgroundColor:item}}>

          </div>
                 ))

            }
        </div>
</div>
    )
        })
}

export default StudentPie







// export default class Example extends PureComponent {
//     static demoUrl = 'https://codesandbox.io/s/pie-chart-with-customized-label-dlhhj';

//     render() {
//         return (
           
//         );
//     }
// }
