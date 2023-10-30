import React, { useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom'

const ExamResult = ({ filteredQuestions, selectedChoices, resetGame, selectedCompetency }) => {
  // State for selectedCompetency
  const [localSelectedCompetency, setLocalSelectedCompetency] = useState('All Competency');

  // Function to filter questions based on selected competency
  const filteredQuestionsByCompetency = localSelectedCompetency === 'All Competency'
    ? filteredQuestions
    : filteredQuestions.filter(question => question.competency_id === localSelectedCompetency);

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
  
  const competencyOptions = [
    { value: 'All Competency', label: 'All Competency' },
    { value: 1, label: 'SWPPS' },
    { value: 2, label: 'Casework' },
    { value: 3, label: 'HBSE' },
    { value: 4, label: 'CO' },
    { value: 5, label: 'Groupwork' },
  ];

  const getCompetencyLabel = (selectedCompetency) => {
  const selectedOption = competencyOptions.find(option => option.value === selectedCompetency);
  return selectedOption ? selectedOption.label : 'Unknown Competency';
  }

  return (
    <div>
      <div className='p-3 my-3 border-2 dark:border-gray-700 dark:rounded-lg dark:bg-slate-900'>
      <div className="competency-buttons">
        {/* Buttons for selecting competencies */}
        {competencyOptions.map(option => (
          <button
            key={option.value}
            className={classNames("bg-transparent mt-3 hover:bg-indigo-700 hover:text-white dark:text-white border-2 border-indigo-700 py-2 px-4 mr-2 rounded", {
              'bg-indigo-700 text-white': localSelectedCompetency === option.value,
            })}
            onClick={() => setLocalSelectedCompetency(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <h1 className="text-2xl font-bold mb-4 justify-center dark:text-white">
        {localSelectedCompetency === 'All Competency' ? 'Competency Results' : getCompetencyLabel(localSelectedCompetency)}
      </h1>

      <h2 className="flex mb-4 mx-auto justify-center text-3xl font-medium dark:text-white">
  Total Score: 
  <span className="text-green-500 mx-2">
    {calculateTotalScore()}
  </span>{' '}
  correct out of 
  <span className="text-orange-500 mx-2">
    {filteredQuestionsByCompetency.length}
  </span> question - 
  <span className="text-blue-500 ml-1">
    ({((calculateTotalScore() / filteredQuestionsByCompetency.length) * 100).toFixed(2)}%)
  </span>
</h2>

      <div className='flex justify-between'> 
      <button
        className="bg-indigo-700 hover-bg-indigo-600 text-white py-2 px-4 mb-3 rounded"
        onClick={resetGame}
      >
        Go back
      </button>
      <Link to="/exam/analytics">
      <button
        className="bg-indigo-700 hover-bg-indigo-600 text-white py-2 px-4 mb-3 rounded"
      >View Analytics
      </button>
      </Link>
      </div>
      </div>
      {filteredQuestionsByCompetency.map((question, index) => (
        <div key={index} className="mb-4 dark:text-white dark:bg-slate-900 p-3 border-2 dark:border-gray-700 dark:rounded-lg">
          <h2 className="text-xl text-center dark:text-white btn-primary">
            Question {index + 1}/{filteredQuestionsByCompetency.length}
          </h2>
          <p className="mb-2 text-lg border-b border-black dark:border-white">{question.questionText}</p>
          <ul>
            {question.choices && question.choices.map((choice, choiceIndex) => (
            <li
              key={choiceIndex}
              className={classNames("container btn-container items-center dark:text-white flex border border-gray-700 mb-2 rounded-3xl cursor-pointer", {
                "bg-green-400": selectedChoices[index] && selectedChoices[index].isCorrect && selectedChoices[index] === choice,
                "bg-red-600": selectedChoices[index] && !selectedChoices[index].isCorrect && selectedChoices[index] === choice,
              })}
            >
              <div className="dark-text-white py-2 px-4 bg-gray-700 text-white font-bold text-lg rounded-3xl m-1 shadow-md btn-primary">
                {String.fromCharCode(65 + choiceIndex)}
              </div>
              <div className="dark-text-white py-2 dark:text-white px-4 text-gray-700 font-semibold">
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