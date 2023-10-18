import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const programOptions = [
    { value: 'Social Work', label: 'Bachelor Science in Social Work' },
    { value: 'Option', label: 'Option' },
  ];

  const competencyOptions = [
    { value: 'SWPPS', label: 'SWPPS' },
    { value: 'Casework', label: 'Casework' },
    { value: 'HBSE', label: 'HBSE' },
    { value: 'CO', label: 'CO' },
    { value: 'Groupwork', label: 'Groupwork' },
  ];

const EditQuestionModal = ({ isOpen, onClose, questionToEdit, programOptions, competencyOptions, fetchQuestions }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [choices, setChoices] = useState([{ choiceText: '', isCorrect: false }]);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (isOpen && questionToEdit) {
      // Fetch associated program and competency for the selected question
      const fetchProgramAndCompetency = async () => {
        try {
          const [program, competency] = await Promise.all([
            // Fetch program based on the question's program_id
            axios.get(`http://localhost:3001/program/${questionToEdit.program_id}`),
            // Fetch competency based on the question's competency_id
            axios.get(`http://localhost:3001/competency/${questionToEdit.competency_id}`),
          ]);

          // Set the selected program and competency options
          setSelectedProgram({ value: program.data.program_id, label: program.data.program_name });
          setSelectedCompetency({ value: competency.data.competency_id, label: competency.data.competency_name });

          setQuestionText(questionToEdit.questionText);
          setChoices(questionToEdit.choices);
        } catch (error) {
          console.error('Error fetching program and competency:', error);
        }
      };

      fetchProgramAndCompetency();
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <form onSubmit={handleSubmit}>
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
              className="block w-full mt-1 px-3 py-2 border border-blue-600 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {choices.map((choice, index) => (
            <div className="flex items-center mb-2" key={index}>
              <input
                type="checkbox"
                checked={choice.isCorrect}
                onChange={() => handleChoiceChange(index, 'isCorrect', !choice.isCorrect)}
                className="w-5 h-5 mr-3"
              />
              <input
                type="text"
                value={choice.choiceText}
                onChange={(e) => handleChoiceChange(index, 'choiceText', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-700 rounded-3xl focus:outline-none focus:border-indigo-500"
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
