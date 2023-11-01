import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { ThemeContext } from "../../components/ThemeContext";

const programOptions = [
    { value: 1, label: 'Bachelor of Science in Social Work' },
  ];

  const competencyOptions = [
    { value: 1, label: 'SWPPS' },
    { value: 2, label: 'Casework' },
    { value: 3, label: 'HBSE' },
    { value: 5, label: 'CO' },
    { value: 6, label: 'Groupwork' },
  ];

const EditQuestionModal = ({ isOpen, onClose, questionToEdit , fetchQuestions }) => {
  const [selectedProgram, setSelectedProgram] = useState({ value: 'Social Work', label: 'Bachelor Science in Social Work' });
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [choices, setChoices] = useState([{ choiceText: '', isCorrect: false }]);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (isOpen && questionToEdit) {
      setSelectedProgram(questionToEdit.program_id);
      setSelectedCompetency(questionToEdit.competency_id);
      console.log('questionToEdit.competency_id:', questionToEdit.competency_id);
      setQuestionText(questionToEdit.questionText);
      setChoices(questionToEdit.choices);
      console.log('questionToEdit:', questionToEdit);
    }
    // Fetch questions when the modal opens
    if (isOpen) {
      fetchQuestions();
    }
  }, [isOpen, questionToEdit]);
  

  const handleAddChoice = () => {
    setChoices([...choices, { choiceText: '', isCorrect: false }]);
  };

  const handleRemoveChoice = (index) => {
    const updatedChoices = [...choices];
    updatedChoices.splice(index, 1);
    setChoices(updatedChoices);
  };

  const handleChoiceChange = (index, field, value) => {
    const updatedChoices = choices.map((choice, i) => {
      if (i === index) {
        return { ...choice, [field]: value };
      } else {
        return { ...choice };
      }
    });

    setChoices(updatedChoices);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Construct the request body
    const requestBody = {
      question_text: questionText,
      program: selectedProgram ? selectedProgram.value : null,
      competency: selectedCompetency ? selectedCompetency.value : null,
      choices,
    };

    // Send a PUT request to update the question
    axios
      .put(`http://localhost:3001/questions/update/${questionToEdit.question_id}`, requestBody)
      .then((response) => {
        setAlertMessage('Question updated successfully');
      })
      .catch((error) => {
        console.error('Error updating question:', error);
        setAlertMessage('Failed to update question');
      });
  };
  const { theme } = useContext(ThemeContext);
  const customStyles = {
    control: (provided, state) => {
      const backgroundColor = theme === 'dark' ? 'slate-700' : 'white'; // Adjust colors for dark mode
      const textColor = theme === 'dark' ? 'white' : 'black';
      return {
        ...provided,
        backgroundColor: backgroundColor,
        color: textColor, // Change `textColor` instead of `text`
        // Add other style properties as needed
      };
    },
    placeholder: (provided, state) => {
      const placeholderColor = theme === 'dark' ? 'white' : 'black'; // Adjust placeholder color for dark mode
      return {
        ...provided,
        color: placeholderColor,
        // Add other style properties for placeholder as needed
      };
    },
  };
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? 'block' : 'hidden'
      } bg-opacity-50 bg-transparent`}
      onClick={onClose}
    >
      <div
        className="modal-container bg-white dark:bg-slate-900 w-3/5 p-4 border-2 border-indigo-700 mb-2 rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-2 right-2 text-white-600" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <form onSubmit={handleSubmit}>
          {alertMessage && (
            <div className="mb-2 text-blue-600 mx-auto justify-center">{alertMessage}</div>
          )}
          <div className="mb-4 dark:text-white">
            <label htmlFor="program" className="block font-bold dark:text-white text-gray-700">
              Program
            </label>
            <Select  className='dark:bg-slate-700 dark:text-white'
              id="program"
              name="program"
              value={selectedProgram}
              onChange={(selectedOption) => setSelectedProgram(selectedOption)}
              options={programOptions}
              styles={customStyles}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="competency" className="block font-bold dark:text-white text-gray-700">
              Competency
            </label>
            <Select className='dark:bg-slate-700 text-black'
  id="competency"
  name="competency"
  value={competencyOptions.find((option) => option.value === selectedCompetency)}
  onChange={(selectedOption) => setSelectedCompetency(selectedOption)}
  options={competencyOptions}
  styles={customStyles}
/>
          </div>

          <div className="mb-4">
            <label htmlFor="questionText" className="block font-bold text-gray-700 dark:text-white">
              Question Text
            </label>
            <textarea
              id="questionText"
              name="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="block w-full mt-1 px-3 py-2 border-2 dark:bg-slate-700 dark:text-white border-blue-600 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {choices.map((choice, index) => (
            <div className="flex items-center mb-2" key={index}>
              <input
                type="checkbox"
                checked={choice.isCorrect}
                onChange={() => handleChoiceChange(index, 'isCorrect', !choice.isCorrect)}
                className="w-5 h-5 mr-3  dark:bg-slate-700 dark:text-white"
              />
              <input
                type="text"
                value={choice.choiceText}
                onChange={(e) => handleChoiceChange(index, 'choiceText', e.target.value)}
                className="flex-1 px-3 py-2 border-2  dark:bg-slate-700 dark:text-white dark:border-indigo-700 rounded-3xl focus:outline-none focus:border-indigo-700"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveChoice(index)}
                className="ml-2 text-red-600 font-bold text-2xl focus:outline-none"
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

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              Update Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestionModal;
