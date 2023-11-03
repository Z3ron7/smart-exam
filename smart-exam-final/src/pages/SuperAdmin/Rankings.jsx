import React, { useEffect, useState } from 'react';
import axios from 'axios';
const goldMedalIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="yellow"
    >
      <path d="M4 2h16c.55 0 1 .45 1 1s-.45 1-1 1H4c-.55 0-1-.45-1-1s.45-1 1-1zm7 6.61l.55 1.78.03.09.12.25.29.44.31.33.39.2l1.66-.17 1.74-.18-.13-.02.14.01c.71 0 1.17.76.77 1.34L15.85 16 13 19.83l.29 1.15c.18.72-.62 1.3-1.26.95l-1.13-.75-1.13.75c-.64.43-1.44-.23-1.26-.95L11 19.83 8.15 16 5.23 15.21c-.4-.58.06-1.34.77-1.34l.14-.01-.13.02 1.74.18 1.66.17c.67.07 1.12-.38 1.21-1.05l.05-.78-.48-.48.03-.16-.05-.1-.13-.18-.29-.32-.31-.26-.29-.1-.64-.66-.05-.2-.55-1.78H12z" />
    </svg>
  );
  
  const silverMedalIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="gray"
    >
      <path d="M4 2h16c.55 0 1 .45 1 1s-.45 1-1 1H4c-.55 0-1-.45-1-1s.45-1 1-1zm7 6.61l.55 1.78.03.09.12.25.29.44.31.33.39.2l1.66-.17 1.74-.18-.13-.02.14.01c.71 0 1.17.76.77 1.34L15.85 16 13 19.83l.29 1.15c.18.72-.62 1.3-1.26.95l-1.13-.75-1.13.75c-.64.43-1.44-.23-1.26-.95L11 19.83 8.15 16 5.23 15.21c-.4-.58.06-1.34.77-1.34l.14-.01-.13.02 1.74.18 1.66.17c.67.07 1.12-.38 1.21-1.05l.05-.78-.48-.48.03-.16-.05-.1-.13-.18-.29-.32-.31-.26-.29-.1-.64-.66-.05-.2-.55-1.78H12z" />
    </svg>
  );
  
  const bronzeMedalIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="saddlebrown"
    >
      <path d="M4 2h16c.55 0 1 .45 1 1s-.45 1-1 1H4c-.55 0-1-.45-1-1s.45-1 1-1zm7 6.61l.55 1.78.03.09.12.25.29.44.31.33.39.2l1.66-.17 1.74-.18-.13-.02.14.01c.71 0 1.17.76.77 1.34L15.85 16 13 19.83l.29 1.15c.18.72-.62 1.3-1.26.95l-1.13-.75-1.13.75c-.64.43-1.44-.23-1.26-.95L11 19.83 8.15 16 5.23 15.21c-.4-.58.06-1.34.77-1.34l.14-.01-.13.02 1.74.18 1.66.17c.67.07 1.12-.38 1.21-1.05l.05-.78-.48-.48.03-.16-.05-.1-.13-.18-.29-.32-.31-.26-.29-.1-.64-.66-.05-.2-.55-1.78H12z" />
    </svg>
  );
  
const Rankings = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/dashboard/fetch-rankings');
        setRankings(response.data);
      } catch (error) {
        console.error('Error fetching rankings:', error);
      }
    };

    fetchRankings();
  }, []);

  const competencyName = {
    6: 'All Competency',
    1: 'SWWPS',
    2: 'Casework',
    3: 'HBSE',
    4: 'CO',
    5: 'Groupwork',
  };

  const getMedalIcon = (index) => {
    if (index === 0) {
      return goldMedalIcon;
    } else if (index === 1) {
      return silverMedalIcon;
    } else if (index === 2) {
      return bronzeMedalIcon;
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <table className="table-auto w-full overflow-y-scroll border-collapse h-80">
        <thead className="bg-slate-600 p-2 font-semibold text-white">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Avatar</th>
            <th className="px-4 py-2">User</th>
            <th className="px-3 py-2">Categories</th>
            <th className="px-3 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((item, index) => {
            const mappedScores = [];

            if (item.score) {
              const scores = JSON.parse(item.score);

              for (const competencyId in scores) {
                const competencyScore = scores[competencyId];
                mappedScores.push({
                  competency: competencyName[competencyId],
                  score: competencyScore,
                });
              }

              const allCompetencyScore = Object.values(scores).reduce(
                (acc, curr) => acc + curr,
                0
              );
              mappedScores.push({
                competency: 'All Competency',
                score: allCompetencyScore,
              });
            }

            const maxScore = mappedScores.reduce(
              (max, score) => Math.max(max, score.score),
              0
            );

            return {
              ...item,
              maxScore,
            };
          })
          .sort((a, b) => b.maxScore - a.maxScore)
          .map((sortedItem, index) => (
            <tr key={index}>
              <td className=" px-4 py-2">
                {getMedalIcon(index)}
              </td>
              <td className=" px-4 py-2">
                <img
                  src={sortedItem.image}
                  alt=""
                  className="rounded-full w-10 h-10"
                />
              </td>
              <td className=" px-4 py-2">{sortedItem.name}</td>
              <td className=" px-4 py-2">{competencyName[sortedItem.competency_id]}</td>
              <td className=" px-4 py-2">
                {sortedItem.maxScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Rankings;
