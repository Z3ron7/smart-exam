import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const programOptions = [
  { value: 'Social Work', label: 'Social Work' },
  { value: 'Option', label: 'Option' },
];

const competencyOptions = [
  { value: 'SWPPS', label: 'SWPPS' },
  { value: 'Casework', label: 'Casework' },
  { value: 'HBSE', label: 'HBSE' },
];

const QuestionModal = ({ isOpen, onClose, fetchQuestions }) => {
  const [formData, setFormData] = useState({
    question_text: '',
    program: null,
    competency: null,
    choices: [],
    answer: '',
  });
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddChoice = () => {
    setFormData({
      ...formData,
      choices: [...formData.choices, ''],
    });
  };

  const handleRemoveChoice = (index) => {
    const newChoices = [...formData.choices];
    newChoices.splice(index, 1);
    setFormData({
      ...formData,
      choices: newChoices,
    });
  };

  const handleCheckboxChange = (choice) => {
    setFormData({
      ...formData,
      answer: choice,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create the request body
      const requestBody = {
        question_text: formData.question_text,
        program: formData.program.value,
        competency: formData.competency.value,
        choices: formData.choices.map((choice) => ({
          choiceText: choice,
          isCorrect: choice === formData.answer, // Set isCorrect based on the answer
        })),
      };

      // Send a POST request to create the question
      const response = await axios.post('http://localhost:3001/questions/create', requestBody);

      // Check the response status
      if (response.status === 200) {
        setAlertMessage('Question created successfully');
        // Clear the form or perform any other necessary actions on success
        setFormData({
          question_text: '',
          program: null,
          competency: null,
          choices: [''],
          answer: '',
        });
      } else {
        setAlertMessage('Failed to create question');
      }
      await fetchQuestions(); // Refresh the list of questions
    } catch (error) {
      console.error('Error creating question:', error);
      setAlertMessage('Failed to create question');
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? 'block' : 'hidden'
      } bg-opacity-50 bg-gray-900`}
      onClick={onClose}
    >
      <div
        className="modal-container bg-white w-3/5 p-4 border border-gray-700 mb-2 rounded-3xl"
        onClick={(e) => e.stopPropagation()}
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
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md">
          {alertMessage && (
            <div className="mb-2 text-blue-600 mx-auto justify-center">{alertMessage}</div>
          )}

          <div className="mb-4">
            <label htmlFor="program" className="block font-bold text-gray-700">
              Program
            </label>
            <Select
              id="program"
              name="program"
              value={formData.program}
              onChange={(selectedOption) => setFormData({ ...formData, program: selectedOption })}
              options={programOptions}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="competency" className="block font-bold text-gray-700">
              Competency
            </label>
            <Select
              id="competency"
              name="competency"
              value={formData.competency}
              onChange={(selectedOption) => setFormData({ ...formData, competency: selectedOption })}
              options={competencyOptions}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="question_text" className="block font-medium mb-2">
              Question Text
            </label>
            <textarea
              type="text"
              id="question_text"
              name="question_text"
              value={formData.question_text}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="choices" className="block font-medium mb-2">
              Choices
            </label>
            <div className="space-y-2">
              {formData.choices.map((choice, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`answer${choice}`}
                    name="answer"
                    checked={formData.answer === choice}
                    onChange={() => handleCheckboxChange(choice)}
                    className="h-5 w-5"
                  />
                  <input
                    type="text"
                    id={`choices${index}`}
                    name={`choices${index}`}
                    value={choice}
                    onChange={(e) => {
                      const newChoices = [...formData.choices];
                      newChoices[index] = e.target.value;
                      setFormData({ ...formData, choices: newChoices });
                    }}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveChoice(index)}
                    className="text-red-600 hover:text-red-800 font-bold focus:outline-none"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddChoice}
                className="mb-2 text-indigo-600 underline focus:outline-none"
              >
                Add Choice
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Create Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
