import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionModal from './QuestionModal';
import Select from 'react-select';

const Questionnaire = () => {
  const [questionsData, setQuestionsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);

  const openModal = (question) => {
    setIsModalOpen(true);
    setQuestionToEdit(question);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setQuestionToEdit(null);
  };

  useEffect(() => {
    // Fetch data from the backend
    axios.get('http://localhost:3001/questions/fetch')
      .then((response) => {
        setQuestionsData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="container min-h-screen h-auto items flex flex-col">
      <div className="flex justify-end">
        <button
          onClick={() => openModal()}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          New Question
        </button>
      </div>

      {/* Render the modal */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        questionToEdit={questionToEdit}
      />

      {/* Render the list of questions */}
      <div className="container min-h-screen h-auto items flex flex-col bg-blue-100">
        {/* Your program and competency dropdowns can go here */}
        
        {/* Render the questions */}
        <div className="grid grid-cols-1 gap-4 mt-4">
          <ul>
            {questionsData.map((question) => (
              <li key={question.question_id}>
                <strong>Program:</strong> {question.program}
                <br />
                <strong>Competency:</strong> {question.competency}
                <br />
                <strong>Question:</strong> {question.questionText}
                <br />
                <strong>Choices:</strong> {question.choices}
                <br />
                <strong>Answer:</strong> {question.answer}
                <br />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
