import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import QuestionModal from './QuestionModal';
import EditQuestionModal from './EditQuestionModal';
import Select from 'react-select';

const Questionnaire = () => {
  const [questionsData, setQuestionsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null); // Set initial program selection
const [selectedCompetency, setSelectedCompetency] = useState(null); // Track selected competency
  const [loading, setLoading] = useState(true);


  const openModal = (question) => {
    setIsModalOpen(true);
    setQuestionToEdit(question);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setQuestionToEdit(null);
  };

  const openEditModal = (question) => {
    setIsModalOpen(true);
    setQuestionToEdit(question);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setQuestionToEdit(null);
  };

  
   const fetchQuestions = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/questions/fetch');
      setQuestionsData(response.data); // Limit to 10 randomized questions
      console.log("Data:", response.data)
    } catch (error) {
      console.error('Error fetching data for refresh:', error);
    }
  }, []);
  
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);  


  // Function to generate letters (A, B, C, ...) based on the index
  const generateLetter = (index) => {
    // Assuming you want to start with 'A' for index 0
    return String.fromCharCode(65 + index);
  };

  const programOptions = [
    { value: 'Social Work', label: 'Bachelor of Science in Social Work' },
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
      <header className="dark:bg-slate-900 space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6 mb-2 border-[#4E73DF] border-2">
  <div className="flex items-center ">
    <h2 className="font-semibold text-slate-900 items-center dark:text-white">Exam Room</h2>
  </div>

  <div className="flex text-center py-4 text-lg grid-cols-4 md:grid-cols-2 md:grid-rows-2 font-semibold dark:text-white space-x-4">
    <form className="group relative flex-1">
      <svg width="20" height="20" fill="currentColor" className="absolute left-3 top-1/2 -mt-4 text-slate-400 pointer-events-none group-focus-within:text-blue-500" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
      </svg>
      <input className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none lg:w-96 text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm" type="text" aria-label="Filter projects" placeholder="Search question..." />
    </form>

    <div className="mb-4 w-72">
      
    <Select
                placeholder="Program"
                id="program"
                name="program"
                value={selectedProgram}
                onChange={(selectedOption) => setSelectedProgram(selectedOption)}
                options={programOptions}
              />
    </div>
    <div className="mb-4 w-72">
      
    <Select
                placeholder="Competency"
                id="competency"
                name="competency"
                value={selectedCompetency}
                onChange={(selectedOption) => setSelectedCompetency(selectedOption)}
                options={competencyOptions}
              />
    </div>

    <button
      onClick={() => openModal()}
      className="bg-indigo-700 hover:bg-indigo-600 md:text-sm text-white h-11 py-2 px-4 rounded"
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
</header>

      {/* Render the list of questions */}
      <div className="container min-h-screen h-auto items flex flex-col bg-transparent">
      
        <div className="grid grid-cols-1 gap-4 mt-4">
<ul>
{questionsData.map((question, index) => (
  <li key={question.question_id}>
    <div className="border-2 border-indigo-700 dark:bg-slate-900 shadow-lg items-center justify-center my-2">
      {/* Add the Edit button in the top-right corner */}
      <button
                    onClick={() => openEditModal(question)} // Open the edit modal with the clicked question
                    className=" items-end text-gray-600"
                  >
                    Edit
                  </button>
                  <EditQuestionModal
    isOpen={isModalOpen}
    onClose={closeEditModal}
    questionToEdit={questionToEdit}
    programOptions={programOptions} // Pass program options to EditQuestionModal
        competencyOptions={competencyOptions}
    fetchQuestions={fetchQuestions}
  />
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