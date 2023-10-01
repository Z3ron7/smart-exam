import React from 'react';

const EndExam = ({ userScore, questions, onClose }) => {
  // Calculate the percentage score
  const percentageScore = (userScore / questions.length) * 100;

  return (
    <div className="container min-h-screen h-auto items flex flex-col">
      <div className="my-auto p-6 header-bg">
        <h2 className="font-bold text-lg">
          Congratulations! You have completed the exam.
        </h2>
        {userScore !== null && (
          <>
            <p>Your Score: {userScore} points</p>
            <p>Percentage Score: {percentageScore.toFixed(2)}%</p>
          </>
        )}
        <p>What would you like to do?</p>
        <div className="flex p-3 text-white">
          <button
            className="py-2 px-5 cursor-pointer bg-green-500 rounded-xl mr-3"
            onClick={onClose}
          >
            Close
          </button>
          {/* Add a button to view correct and wrong answers */}
          <button
            className="py-2 px-5 cursor-pointer btn-primary rounded-xl"
            onClick={() => console.log('View Answers')} // Replace with logic to view answers
          >
            View Answers
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndExam;