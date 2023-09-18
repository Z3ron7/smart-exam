import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const QuestionModal = ({ isOpen, onClose }) => {
  const [questionText, setQuestionText] = useState('');
  const [choiceText, setChoiceText] = useState([{ choiceText: '', isCorrect: false }]);
  const [answerText, setAnswerText] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCompetency, setSelectedCompetency] = useState(null);

  const handleAddChoice = () => {
    setChoiceText([...choiceText, { choiceText: '', isCorrect: false }]);
  };

  const handleRemoveChoice = (index) => {
    const updatedChoices = [...choiceText];
    updatedChoices.splice(index, 1);
    setChoiceText(updatedChoices);
  };

  const handleChoiceChange = (index, field, value) => {
    const updatedChoices = [...choiceText];
    updatedChoices[index] = {
      ...updatedChoices[index],
      [field]: value,
    };
    setChoiceText(updatedChoices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (
      questionText.trim() === '' ||
      choiceText.some((choice) => choice.choiceText.trim() === '') ||
      answerText.trim() === '' ||
      !selectedProgram ||
      !selectedCompetency
    ) {
      return;
    }
  
    try {
      // Create the question with programName and competencyName
      const questionResult = await axios.post(
        'http://localhost:3001/questions/create',
        {
          programName: selectedProgram.label, // Assuming 'label' contains the program name
          competencyName: selectedCompetency.label, // Assuming 'label' contains the competency name
          questionText: questionText,
          answerText: answerText,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      const question_id = questionResult.data.question_id;
  
      // Insert choices into the choices table
      if (choiceText && choiceText.length > 0) {
        for (const choice of choiceText) {
          const { choiceText, isCorrect } = choice;
  
          console.log('Inserting into choices table:', {
            question_id: question_id,
            choiceText: choiceText,
            isCorrect: isCorrect,
          });
  
          await axios.post(
            `http://localhost:3001/questions/choices/create/${question_id}`,
            {
              choices: [{ choiceText, isCorrect }],
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }
      }
  
      console.log('Data saved successfully');
      setAlertMessage('Question added successfully');
      setQuestionText('');
      setChoiceText([{ choiceText: '', isCorrect: false }]);
      setAnswerText('');
      setSelectedProgram(null);
      setSelectedCompetency(null);
    } catch (error) {
      console.error(error);
      setAlertMessage('Error adding question');
    }
  };
  
  
  
  const programOptions = [
    { value: 'social_work', label: 'Social Work' },
    { value: 'option', label: 'Option' },
  ];

  const competencyOptions = [
    { value: 'human_behavior', label: 'Human Behavior and Social Environment' },
    { value: 'social_case_work', label: 'Social Case Work' },
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
        <form onSubmit={handleSubmit}>
          {alertMessage && (
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

          {choiceText.map((choice, index) => (
            <div className="flex items-center mb-2" key={index}>
              <input
                type="text"
                value={choice.choiceText}
                onChange={(e) => handleChoiceChange(index, 'choiceText', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-700 rounded-3xl focus:outline-none focus:border-indigo-500"
                required
              />
              <input
                type="checkbox"
                checked={choice.isCorrect}
                onChange={(e) => handleChoiceChange(index, 'isCorrect', e.target.checked)}
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
