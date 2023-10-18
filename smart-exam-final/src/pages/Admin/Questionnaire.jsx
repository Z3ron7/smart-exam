import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import QuestionModal from './QuestionModal';
import Select from 'react-select';

const Questionnaire = () => {
  const [questionsData, setQuestionsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState({ value: 'Social Work', label: 'Bachelor Science in Social Work' }); // Track selected program
  const [selectedCompetency, setSelectedCompetency] = useState({ value: 'All Competency', label: 'All Competency' }); // Track selected competency
  const [loading, setLoading] = useState(true);


  const openModal = (question) => {
    setIsModalOpen(true);
    setQuestionToEdit(question);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setQuestionToEdit(null);
  };

  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/questions/fetch');
        setQuestionsData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Function to generate letters (A, B, C, ...) based on the index
  const generateLetter = (index) => {
    // Assuming you want to start with 'A' for index 0
    return String.fromCharCode(65 + index);
  };

  const handleProgramSelect = (selectedOption) => {
    setSelectedProgram(selectedOption);
    fetchFilteredQuestions(selectedOption, selectedCompetency);
  };

  // Function to handle competency selection
  const handleCompetencySelect = (selectedOption) => {
    setSelectedCompetency(selectedOption);
    fetchFilteredQuestions(selectedProgram, selectedOption);
  };

  // Function to fetch filtered questions from the backend
  const fetchFilteredQuestions = (program, competency) => {
    // Make an HTTP request to your backend with selected program and competency
    axios.get(`http://localhost:3001/questions/fetch?program=${program?.value || ''}&competency=${competency?.value || ''}`)
      .then((response) => {
        setQuestionsData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const programOptions = [
    { value: 'Social Work', label: 'Bachelor Science in Social Work' },
    { value: 'Option', label: 'Option' },
  ];

  const competencyOptions = [
    { value: 'All Competency', label: 'All Competency' },
    { value: 'SWPPS', label: 'SWPPS' },
    { value: 'Casework', label: 'Casework' },
    { value: 'HBSE', label: 'HBSE' },
    { value: 'CO', label: 'CO' },
    { value: 'Groupwork', label: 'Groupwork' },
  ];

  return (
    <div className="container min-h-screen h-auto items flex flex-col">
      <div className="flex text-center py-4 header-bg shadow-md text-lg font-semibold dark:text-white ">
        <div className=" flex gap-8 justify-center items-center mx-auto dark:text-white"></div>
      <div className="flex justify-end">
        <button
          onClick={() => openModal()}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          New Question
        </button>
      </div>
      </div>

      {/* Render the modal */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        questionToEdit={questionToEdit}
      />

      {/* Render the list of questions */}
      <div className="container min-h-screen h-auto items flex flex-col bg-blue-100 dark:bg-slate-700">
      <div className="flex text-center py-4 header-bg shadow-md text-lg font-semibold dark:text-white ">
          <div className=" flex gap-8 justify-center items-center mx-auto dark:text-white">
          <div className="mb-4">
      <label htmlFor="program" className="block font-bold text-gray-700">
        Program
      </label>
      <Select
        id="program"
        name="program"
        value={selectedProgram}
        onChange={handleProgramSelect}
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
        onChange={handleCompetencySelect}
        options={competencyOptions}
      />
    </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
<ul>
  {questionsData.map((question, index) => (
    <li key={question.question_id}>
      <div className="border-2 shadow-lg items-center justify-center my-2">
        <div className="text-xl text-center dark:text-white btn-primary">
          Question
        </div>
        <div className="p-3 dark:text-white text-2xl text-center">{question.questionText}</div>
        <div id="answers-container" className="p-3">
          {question.choices.map((choice, choiceIndex) => (
            <div
              className="container btn-container items-center flex border border-gray-700 mb-2 rounded-3xl cursor-pointer"
              key={choiceIndex}
            >
              <div className="dark:text-white py-2 px-4 bg-gray-700 text-white font-bold text-lg rounded-3xl m-1 shadow-md btn-primary">
                {generateLetter(choiceIndex)}
              </div>
              <div className="dark:text-white py-2 px-4 text-gray-700 font-semibold">{choice.choiceText}</div>
            </div>
          ))}
        </div>
        <div className="flex mb-4 items-center">
<span className="font-bold mr-3 text-lg dark:text-white">Answer:</span>
<span className="container btn-container h-[80px] items-center flex border dark:text-white text-lg border-gray-700 mb-2 rounded-3xl ml-4">
  {question.choices.filter((choice) => choice.isCorrect).map((choice) => choice.choiceText).join(', ')}
</span>



</div>
      </div>
    </li>
  ))}
</ul>
</div>

      </div>
    </div>
  );
};

export default Questionnaire;