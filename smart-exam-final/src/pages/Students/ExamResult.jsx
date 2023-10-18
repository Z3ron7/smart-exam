import React, { useState } from 'react';
import classNames from 'classnames';

const ExamResult = ({ filteredQuestions, selectedChoices, resetGame }) => {
  const [selectedCompetency, setSelectedCompetency] = useState('All Competency');

  // Function to filter questions based on selected competency
  const filteredQuestionsByCompetency = selectedCompetency === 'All Competency'
    ? filteredQuestions
    : filteredQuestions.filter(question => question.competency_id === selectedCompetency);

  // Function to calculate the total score for selected questions
  const calculateTotalScore = () => {
    return filteredQuestionsByCompetency.reduce((totalScore, question, index) => {
      const selectedChoice = selectedChoices[index];
      if (selectedChoice && selectedChoice.isCorrect) {
        return totalScore + 1;
      }
      return totalScore;
    }, 0);
  };
  

  return (
    <div>
      <div className="competency-buttons">
        {/* Buttons for selecting competencies */}
        <button
          className={classNames("bg-transparent hover:bg-indigo-700 active:bg-indigo-700 dark-text-white border-2 border-indigo-700 py-2 px-4 mr-2 rounded", {
            'bg-indigo-700': selectedCompetency === 'All Competency',
          })}
          onClick={() => setSelectedCompetency('All Competency')}
        >
          All Competency
        </button>
        <button
          className={classNames("bg-transparent hover:bg-indigo-700 active:bg-indigo-700 dark-text-white border-2 border-indigo-700 py-2 px-4 mr-2 rounded", {
            'bg-indigo-700': selectedCompetency === 1,
          })}
          onClick={() => setSelectedCompetency(1)}
        >
          SWPPS
        </button>
        <button
          className={classNames("bg-transparent hover:bg-indigo-700 active:bg-indigo-700 dark-text-white border-2 border-indigo-700 py-2 px-4 mr-2 rounded", {
            'bg-indigo-700': selectedCompetency === 2,
          })}
          onClick={() => setSelectedCompetency(2)}
        >
          Casework
        </button>
        <button
          className={classNames("bg-transparent hover:bg-indigo-700 active:bg-indigo-700 dark-text-white border-2 border-indigo-700 py-2 px-4 rounded", {
            'bg-indigo-700': selectedCompetency === 3,
          })}
          onClick={() => setSelectedCompetency(3)}
        >
          HBSE
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Competency Results</h1>
      <h2 className="flex mb-4 mx-auto justify-center">
        Total Score: {calculateTotalScore()} out of {filteredQuestionsByCompetency.length} correct - ({((calculateTotalScore() / filteredQuestionsByCompetency.length) * 100).toFixed(2)}%)
      </h2>
      <button
        className="bg-blue-500 hover-bg-blue-600 text-white py-2 px-4 rounded"
        onClick={resetGame}
      >
        Restart Game
      </button>
      {filteredQuestionsByCompetency.map((question, index) => (
        <div key={index} className="mb-4">
          <h2 className="text-xl text-center dark-text-white btn-primary">
            Question {index + 1}/{filteredQuestionsByCompetency.length}
          </h2>
          <p className="mb-2">{question.questionText}</p>
          <ul>
            {question.choices && question.choices.map((choice, choiceIndex) => (
              <li
                key={choiceIndex}
                className={classNames("container btn-container items-center flex border border-gray-700 mb-2 rounded-3xl cursor-pointer", {
                  "bg-green-400": selectedChoices[index].isCorrect && selectedChoices[index] === choice,
                  "bg-red-600": !selectedChoices[index].isCorrect && selectedChoices[index] === choice,
                })}
              >
                <div className="dark-text-white py-2 px-4 bg-gray-700 text-white font-bold text-lg rounded-3xl m-1 shadow-md btn-primary">
                  {String.fromCharCode(65 + choiceIndex)}
                </div>
                <div className="dark-text-white py-2 px-4 text-gray-700 font-semibold">
                  {choice.choiceText}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ExamResult;
