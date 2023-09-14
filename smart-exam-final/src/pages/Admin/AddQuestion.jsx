// AddQuestionForm.js

import React, { useState } from 'react';
import axios from 'axios';

const AddQuestion = () => {
  const [questionText, setQuestionText] = useState('');
  const [choices, setChoices] = useState(['', '']); // Initial two empty choices

  const handleAddChoice = () => {
    setChoices([...choices, '']);
  };

  const handleRemoveChoice = (index) => {
    const updatedChoices = choices.filter((_, i) => i !== index);
    setChoices(updatedChoices);
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/questions', {
        questionText,
        choices,
        // Additional data like programId and competencyId can be included here
      });

      // Handle success response
      console.log(response.data);
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
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

      <button
        type="button"
        onClick={handleAddChoice}
        className="mb-2 text-indigo-600 underline focus:outline-none"
      >
        Add Choice
      </button>

      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
};

export default AddQuestion;
