import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const QuestionModal = ({ isOpen, onClose }) => {
  const [questionText, setQuestionText] = useState('');
  const [choices, setChoices] = useState(['']);
  const [answerText, setAnswerText] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [alertMessage, setAlertMessage] = useState(''); // State for the alert message
  const [selectedProgram, setSelectedProgram] = useState(null); // Add selected program state
  const [selectedCompetency, setSelectedCompetency] = useState(null);

  const handleAddChoice = () => {
    setChoices([...choices, '']);
  };

  const handleRemoveChoice = (index) => {
    const updatedChoices = [...choices];
    updatedChoices.splice(index, 1);
    setChoices(updatedChoices);
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (questionText.trim() === '' || choices.some(choice => choice.trim() === '') || answerText.trim() === '') {
      return; // Prevent empty questions, choices, and answers
    }

    // Create an object with the data to send to the backend
    const newData = { // Replace with the appropriate exam_id
      program: selectedProgram.label, // Include the selected program
      competency: selectedCompetency.label,
      questionText: questionText,
      choicesText: choices,
      answerText: answerText,
      isCorrect: isCorrect,
    };

    // Make a POST request to your backend to create a new question, choices, and answer
    axios.post('http://localhost:3001/questions/create', newData)
      .then((response) => {
        // Handle success response
        console.log(response.data);
        setAlertMessage('Question added successfully'); // Set the alert message
        // Clear the inputs
        // setQuestionText('');
        // setChoices(['']);
        // setAnswerText('');
        // setIsCorrect(false); 
        // setSelectedProgram(null); // Clear selected program
        // setSelectedCompetency(null); // Clear selected competency
      })
      .catch((error) => {
        // Handle error
        console.error(error);
        setAlertMessage('Error adding question'); // Set the alert message for errors
      });
  };

  const programOptions = [
    { value: 'social_work', label: 'Social Work' },
    { value: 'option', label: 'Option' },
    // Add more options as needed
  ];

  // Options for the competency dropdown
  const competencyOptions = [
    { value: 'human_behavior', label: 'Human Behavior and Social Environment' },
    { value: 'social_case_work', label: 'Social Case Work' },
    // Add more options as needed
  ];


  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? 'block' : 'hidden'
      } bg-opacity-50 bg-gray-900`}
      onClick={onClose}
    >
      <div
        className="modal-container bg-white w-3/5 p-4 border border-gray-700 mb-2 rounded-3xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <form onSubmit={handleSubmit}>
        {alertMessage && ( // Display the alert message if it's set
            <div className="mb-2 text-blue-600 mx-auto justify-center">
              {alertMessage}
            </div>
          )}
          <div className="mb-4">
        <label htmlFor="program" className="block font-bold text-gray-700">
          Program
        </label>
        <Select
          id="program"
          name="program"
          value={selectedProgram}
          onChange={(selectedOption) => setSelectedProgram(selectedOption)}
          options={programOptions}
        />
      </div>

      {/* Competency Dropdown */}
      <div className="mb-4">
        <label htmlFor="competency" className="block font-bold text-gray-700">
          Competency
        </label>
        <Select
          id="competency"
          name="competency"
          value={selectedCompetency}
          onChange={(selectedOption) => setSelectedCompetency(selectedOption)}
          options={competencyOptions}
        />
      </div>
          <div className="mb-4">
            <label htmlFor="questionText" className="block font-bold text-gray-700">
              Question Text
            </label>
            <textarea
              id="questionText"
              name="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="block w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {choices.map((choice, index) => (
            <div className="flex items-center mb-2" key={index}>
              <input
                type="text"
                value={choice}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-700 rounded-3xl focus:outline-none focus:border-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveChoice(index)}
                className="ml-2 text-red-600 focus:outline-none"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mb-4">
            <label htmlFor="answer" className="block font-bold text-gray-700">
              Answer
            </label>
            <input
              id="answer"
              name="answer"
              type="text"
              value={answerText}
              checked={isCorrect}
              onChange={(e) => setAnswerText(e.target.value)}
              className="flex-1 w-full px-3 py-2 border border-green-700 rounded-3xl focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="button"
            onClick={handleAddChoice}
            className="mb-2 text-indigo-600 underline focus:outline-none"
          >
            Add Choice
          </button>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-300 text-gray-600 hover:bg-gray-400 py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
  type="submit"
  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
>
  Add Question
</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
