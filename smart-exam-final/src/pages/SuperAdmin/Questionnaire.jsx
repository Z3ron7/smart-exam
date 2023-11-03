import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import QuestionModal from './QuestionModal';
import EditQuestionModal from './EditQuestionModal';
import Select from 'react-select';
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const Questionnaire = () => {
  const [questionsData, setQuestionsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(null);
  const questionsPerPage = 15; 
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [questionToEdits, setQuestionToEdits] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState({ value: 'Social Work', label: 'Social Work' });
  const [selectedCompetency, setSelectedCompetency] = useState({ value: 'All Competency', label: 'All Competency' });
  const [loading, setLoading] = useState(true);


  const openModal = (question) => {
    setModalOpen(true);
    setQuestionToEdits(question);
  };

  const closeModal = () => {
    setModalOpen(false);
    setQuestionToEdits(null);
  };

  const openEditModal = (question) => {
    setIsModalOpen(true);
    setQuestionToEdit(question);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setQuestionToEdit(null);
  };

  function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  function shuffleArrayWithCorrectChoice(questions) {
    const shuffledQuestions = [...questions];
  
    for (let i = 0; i < shuffledQuestions.length; i++) {
      if (shuffledQuestions[i].choices) {
        const correctChoices = shuffledQuestions[i].choices.filter((choice) => choice.isCorrect);
        const incorrectChoices = shuffledQuestions[i].choices.filter((choice) => !choice.isCorrect);
  
        if (correctChoices.length > 0 && incorrectChoices.length > 2) {
          // Shuffle the choices, ensuring one correct and three incorrect choices
          const shuffledCorrectChoice = shuffleArray(correctChoices);
          const shuffledIncorrectChoices = shuffleArray(incorrectChoices.slice(0, 3));
          shuffledQuestions[i].choices = [...shuffledCorrectChoice, ...shuffledIncorrectChoices];
        }
      }
    }
  
    return shuffledQuestions;
  }  
  
    const fetchData = async () => {
      try {
        if (selectedProgram) {
          let response;
          const maxQuestionsPerCategory = 100; // Set the maximum questions per category
          let maxQuestions = 0; // Initialize maxQuestions to zero

          if (selectedCompetency?.value === 'All Competency') {
            // Check if competency data is already saved in local storage
            const competencyDataAll = localStorage.getItem('competencyData_All');
            if (competencyDataAll) {
              const parsedData = JSON.parse(competencyDataAll);
              response = { data: parsedData };
              // Set maxQuestions to the number of questions available for all competencies
              maxQuestions = parsedData.length;
            } else {
              // Fetch questions for all available competencies
              const competencies = ['SWPPS', 'Casework', 'HBSE', 'CO', 'Groupwork']; // Replace with your predefined competencies
              const allQuestions = [];
  
              // Fetch questions for each competency and merge the results
              for (const competency of competencies) {
                const competencyResponse = await axios.get(
                  `http://localhost:3001/questions/fetch?program=${selectedProgram.label || ''}&competency=${competency}`
                );
  
                // Limit to maxQuestionsPerCategory questions per category
                const limitedQuestions = shuffleArray(competencyResponse.data).slice(0, maxQuestionsPerCategory);
                maxQuestions += limitedQuestions.length; // Increment the total questions count
  
                // Check if maxQuestions exceeds 500, and if so, truncate the questions.
                if (maxQuestions > 500) {
                  const overflow = maxQuestions - 500;
                  limitedQuestions.splice(-overflow);
                  maxQuestions = 500;
                }
  
                allQuestions.push(...limitedQuestions);
  
                // If maxQuestions is already 500, break the loop.
                if (maxQuestions >= 500) {
                  break;
                }
              }
  
              response = { data: allQuestions };
              localStorage.setItem('selectedCompetencyId', 'All');
              localStorage.setItem('competencyData_All', JSON.stringify(allQuestions));
            }
          } else if (selectedCompetency) {
            // Check if competency data is already saved in local storage
            const competencyData = localStorage.getItem(`competencyData_${selectedCompetency.value}`);
            if (competencyData) {
              const parsedData = JSON.parse(competencyData);
              response = { data: parsedData };
              // Set maxQuestions to the number of questions available for the selected competency
              maxQuestions = parsedData.length;
            } else {
              // Fetch questions for the selected competency
              response = await axios.get(
                `http://localhost:3001/questions/fetch?program=${selectedProgram.label || ''}&competency=${selectedCompetency.value || ''}&search=${searchQuery}`
              );
  
              // Limit to maxQuestionsPerCategory questions for the selected category
              response.data = shuffleArray(response.data).slice(0, maxQuestionsPerCategory);
              maxQuestions = response.data.length; // Set the total questions count
  
              // Truncate if maxQuestions exceeds 500
              if (maxQuestions > 500) {
                response.data.splice(-maxQuestions + 500);
                maxQuestions = 500;
              }
  
              // Save the competency data to local storage
              localStorage.setItem(`competencyData_${selectedCompetency.value}`, JSON.stringify(response.data));
            }
            localStorage.setItem('selectedCompetencyId', selectedCompetency.value);
          } else {
            // If no competency is selected, use all questions
            return; // Exit early to avoid setting state again
          }
  
          const storedCurrentQuestion = localStorage.getItem('currentQuestion');
        if (storedCurrentQuestion) {
          currentQuestion = parseInt(storedCurrentQuestion, 10);
          setCurrentQuestion(currentQuestion);
        } else {
          setCurrentQuestion(0);
        }
  
          const randomizedQuestions = shuffleArray(response.data).slice(0, 500);
          // Process choices
          const processedQuestions = shuffleArrayWithCorrectChoice(randomizedQuestions);
  
          setQuestionsData(processedQuestions);
          setMaxQuestions(maxQuestions); // Set the total questions count
          setLoading(true)
          console.log('filteredQuestions:', response.data);
          console.log('selectedCompetencyId', selectedCompetency.value);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    useEffect(() => {
  
    fetchData();
  }, [searchQuery, selectedProgram, selectedCompetency]);


  // Function to generate letters (A, B, C, ...) based on the index
  const generateLetter = (index) => {
    // Assuming you want to start with 'A' for index 0
    return String.fromCharCode(65 + index);
  };
  const handleDelete = (questionId) => {
    // Make an API request to delete the question by its ID
    axios
      .delete(`http://localhost:3001/questions/delete/${questionId}`)
      .then((response) => {
        // Handle success, for example, you can close the modal or update the questions list
        console.log('Question deleted successfully');
        // Close the modal or update the questions list here
      })
      .catch((error) => {
        console.error('Error deleting question:', error);
        // Handle the error, display an error message, or take other appropriate actions
      });
  };
  const programOptions = [
    { value: 'Social Work', label: 'Bachelor of Science in Social Work' },
  ];
  
  const competencyOptions = [
    { value: 'All Competency', label: 'All Competency' },
    { value: 'SWPPS', label: 'SWPPS' },
    { value: 'Casework', label: 'Casework' },
    { value: 'HBSE', label: 'HBSE' },
    { value: 'CO', label: 'CO' },
    { value: 'Groupwork', label: 'Groupwork' },
  ];

  const nextPage = () => {
    const nextPage = Math.min(currentPage + 1, totalPages); // Ensure we don't go beyond the last page
    const nextQuestion = (nextPage - 1) * questionsPerPage;
    setCurrentQuestion(nextQuestion);
  };
  
  const prevPage = () => {
    const prevPage = Math.max(currentPage - 1, 1); // Ensure we don't go before the first page
    const prevQuestion = (prevPage - 1) * questionsPerPage;
    setCurrentQuestion(prevQuestion);
  };
  
  const handlePageClick = (page) => {
  const newPage = Math.max(1, Math.min(page, totalPages)); // Ensure the selected page is within valid bounds
  const newQuestion = (newPage - 1) * questionsPerPage;
  setCurrentQuestion(newQuestion);
  };
  
  const totalPages = Math.ceil(maxQuestions / questionsPerPage);
    const currentPage = Math.floor(currentQuestion / questionsPerPage) + 1;
    const displayPages = 4;
    const pages = [];
    for (let i = Math.max(1, currentPage - Math.floor(displayPages / 2)); i <= Math.min(totalPages, currentPage + Math.floor(displayPages / 2)); i++) {
      pages.push(i);
    }
  return (
    <div className="container min-h-screen h-auto items flex flex-col">
      <header className="dark:bg-slate-900 space-y-2 p-2 sm:px-8 sm:py-6 lg:p-2 mb-2 border-2 border-slate-600 rounded-lg">
  <div className="flex items-center ">
    <h2 className="font-semibold text-slate-900 items-center dark:text-white">Exam Room</h2>
  </div>

  <div className="flex flex-col w-full lg:grid lg:grid-rows-2 lg:grid-cols-1 text-center py-2 text-lg font-semibold dark:text-white space-x-4">
  <div className="flex items-center justify-between w-full">
  <form className="group flex-1 mb-3 mr-3 relative">
  <svg
    width="20"
    height="20"
    fill="currentColor"
    className="absolute left-0 top-1/2 -mt-2.5 ml-2 text-slate-400 pointer-events-none group-focus-within:text-blue-500"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
    />
  </svg>
  <input
          className="focus:ring-2 focus:ring-blue-500 w-full focus:outline-none appearance-none lg:w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
          type="text"
          aria-label="Filter questions"
          placeholder="Search question and choices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state as the user types
        />
</form>

    <button
      onClick={() => openModal()}
      className="flex bg-indigo-700 hover:bg-indigo-600 w-32 justify-center items-center text-sm text-center mb-3 text-white h-10 py-2 px-4 rounded"
    >
     New Question
    </button>
  </div>
  <div className="flex space-x-4 lg:order-last items-center justify-center">
    <Select className="text-black"
      placeholder="Program"
      id="program"
      name="program"
      value={selectedProgram}
      onChange={(selectedOption) => setSelectedProgram(selectedOption)}
      options={programOptions}
    />
    <Select className="text-black"
      placeholder="Competency"
      id="competency"
      name="competency"
      value={selectedCompetency}
      onChange={(selectedOption) => setSelectedCompetency(selectedOption)}
      options={competencyOptions}
    />
  </div>
</div>



  {/* Render the modal */}
  <QuestionModal
    isOpen={modalOpen}
    onClose={closeModal}
    questionToEdit={questionToEdits}
  />
</header>

      {/* Render the list of questions */}
      <div className="container min-h-screen h-auto items flex flex-col bg-transparent">
      
        <div className="grid grid-cols-1 gap-4 mt-4">
        <ul>
  {questionsData.slice(currentQuestion, currentQuestion + questionsPerPage).map((question, index) => (
    <li key={question.question_id}>
      <div className="border-2 border-slate-600 rounded-lg dark:bg-slate-900 shadow-lg items-center justify-center my-2">
        <div className="flex justify-end"> {/* Create a flex container for buttons */}
          <div className='m-2'>
            <button
              onClick={() => {
                console.log('Question:', question);
                openEditModal(question);
              }}
              className="items-end text-green-600 text-base"
            >
               <img className='w-5 h-5' src="/view.svg" alt="" />
            </button>
          </div>
          <div className='mr-4 mt-2'>
            <button
              onClick={() => {
                const confirmDelete = window.confirm("Are you sure you want to delete this question?");
                if (confirmDelete) {
                  handleDelete(question.question_id);
                }
              }}
              className="items-end text-red-600"
            >
              <img className='w-5 h-5' src="../delete.svg" alt="" />

            </button>
          </div>
        </div>
        <EditQuestionModal
          isOpen={isModalOpen}
          onClose={closeEditModal}
          questionToEdit={questionToEdit}
          programOptions={programOptions}
          competencyOptions={competencyOptions}
          fetchData={fetchData}
        />
        <div className="p-3 dark:text-white lg:text-2xl sm:text-sm md:text-lg text-center">{question.questionText}</div>
        <div id="answers-container" className="p-3">
          {question.choices.map((choice, choiceIndex) => (
            <div
              className="container items-center flex border border-gray-700 mb-2 rounded-3xl"
              key={choiceIndex}
            >
              <div className="dark:text-white py-2 px-4 bg-gray-700 text-white font-bold lg:text-lg sm:text-sm md:text-md rounded-3xl m-1 shadow-md btn-primary">
                {generateLetter(choiceIndex)}
              </div>
              <div className="dark:text-white py-2 px-4 text-gray-700 font-semibold lg:text-xl sm:text-sm md:text-lg">{choice.choiceText}</div>
            </div>
          ))}
        </div>
        <div className="flex mb-4 items-center">
          <span className="font-bold mx-3 text-lg dark:text-white">Answer:</span>
          <span className="container px-3 py-2 h-fit w-fit items-center flex border-3 dark:text-white lg:text-lg sm:text-sm md:text-lg border-gray-700 mb-2 rounded-2xl ml-4">
            {question.choices.filter((choice) => choice.isCorrect).map((choice) => choice.choiceText).join(', ')}
          </span>
        </div>
      </div>
    </li>
  ))}
</ul>

</div>

      </div>
      <div className="flex justify-center p-4">
          <div className="container flex justify-center header-bg dark:text-white">
          <ul className="list-style-none flex">
          <li>
        {currentPage > 1 && (
          <button
          className="relative rounded h-10 mr-2 bg-indigo-700 px-3 py-1.5 text-sm font-medium text-white transition-all duration-300 flex items-center"
          onClick={prevPage}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4 mr-2" />
          Previous
        </button>
        
        )}
      </li>
      {pages.map((page) => (
        <li key={page}>
          <button
            className={`${
              currentPage === page
                ? "bg-indigo-700 text-white "
                : "hover:bg-indigo-600 hover:text-white dark:text-white text-black"
            } py-2 px-4 rounded gap-1`}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </button>
        </li>
      ))}
      <li>
        {currentPage < totalPages && (
          <button
            className="relative rounded bg-indigo-700 hover:bg-indigo-600 text-white ml-2 py-2 px-4 flex items-center"
            onClick={nextPage}
          >
            Next
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4 ml-2" />
          </button>
        )}
      </li>
            </ul>
          </div>
          </div>
    </div>
  );
};

export default Questionnaire;