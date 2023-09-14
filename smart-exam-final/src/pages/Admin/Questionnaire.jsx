// Questionnaire.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionModal from './QuestionModal';

const Questionnaire = () => {
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [questionsData, setQuestionsData] = useState([]);

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
        setQuestionsData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const addQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
    closeModal();
  };

  const editQuestion = (editedQuestion) => {
    const updatedQuestions = questions.map((question) =>
      question === questionToEdit ? { ...question, ...editedQuestion } : question
    );
    setQuestions(updatedQuestions);
    closeModal();
  };

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
        addQuestion={addQuestion}
        editQuestion={editQuestion}
        questionToEdit={questionToEdit}
      />

      {/* Render the list of questions */}
      <div className="bg-red-500">
      <div className="grid grid-cols-1 gap-4 mt-4">
      <ul>
        {questionsData.map((question) => (
          <li key={question.question_id}>
            <strong>Question:</strong> {question.questionText}
            <br />
            <strong>Choices:</strong> {question.choices}
            <br />
            <strong>Program:</strong> {question.program}
            <br />
            <strong>Competency:</strong> {question.competency}
            <br />
            <strong>Answer Key:</strong> {question.answer}
            <br />
            <strong>Is Correct:</strong> {question.is_correct ? 'Yes' : 'No'}
          </li>
        ))}
      </ul>
      </div>
      </div>
    </div>
  );
};

export default Questionnaire;
