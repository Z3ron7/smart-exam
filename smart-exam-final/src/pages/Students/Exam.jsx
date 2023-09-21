import { useEffect, useState, useCallback } from "react";
import Select from 'react-select';
import EndExitExam from './EndExitExam'; 
import axios from 'axios';
import Countdown from './Countdown';


function Exam() {
  const [currentGame, setCurrentGame] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [currentGamePlaying, setCurrentGamePlaying] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const initialChoices = Array(currentGame.length).fill(null).map(() => ({
    choiceText: "", // Add other properties as needed
    isUsed: false,  // Initialize isUsed to false
  }));
  const [selectedChoices, setSelectedChoices] = useState(initialChoices);


  const questionsPerPage = 5;


  const getGameData = useCallback(() => {
    axios
      .get('http://localhost:3001/questions/fetch')
      .then((response) => {
        console.log('Response data:', response.data); // Add this line
        setCurrentGame(response.data);
        setMaxQuestions(response.data.length);
        setCurrentQuestion(0);
        setSelectedChoices(Array(response.data.length).fill(-1));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); // Use an empty dependency array because there are no dependencies
  
  useEffect(() => {
    getGameData();
  }, [getGameData, currentGamePlaying]);

  const updateScore = (answer_index, question_index, el) => {
    if (question_index >= maxQuestions || !currentGame || question_index >= currentGame.length) {
      return; // Handle or display end game logic here
    }
  
    const question = currentGame[question_index];
  
    // Check if the selected answer is correct
    if (answer_index === question.correct) {
      // Increment the player's score
      setPlayerScore(playerScore + 1);
    }
  
    // Update the selected choice for the current question
    setSelectedChoices((prevChoices) => {
      const updatedChoices = [...prevChoices];
      updatedChoices[question_index] = {
        ...updatedChoices[question_index],
        isUsed: true, // Set isUsed to true for the selected choice
      };
      return updatedChoices;
    });
  
    // Apply the highlighting class to the selected choice here
    el.target.classList.toggle("bg-blue-500", true);
    el.target.classList.toggle("text-white", true);
  };
  
  const submitExam = () => {
    if (!currentGame || !Array.isArray(currentGame)) {
      console.error('Current game data is missing or not an array.');
      return;
    }
  
    const examResults = currentGame.map((question, index) => ({
      question_id: question.id,
      selected_choice: selectedChoices[index].isUsed ? selectedChoices[index].choice_id : null,
      // Other properties...
    }));
    console.log('Exam Results:', examResults); // Add this line

    // Send the exam results to the backend
    axios
      .post("http://localhost:3001/exams/exams/submit", {
        examResults,
        totalScore: playerScore,
      })
      .then((response) => {
        // Handle success response if needed
        console.log("Exam submitted successfully");
      })
      .catch((error) => {
        console.error("Error submitting exam:", error);
        // Handle error if needed
      });
  };
  
  

  const EndExam = () => {
    return (
      <EndExitExam
        playerScore={playerScore}
        questions={currentGame}
        onClose={() => setCurrentQuestion(maxQuestions)} // Close the end screen and show the end of exam summary
      />
    );
  };
  
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  // Use a separate useEffect to refresh the data
  const refresh = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/questions/refresh');
      setFilteredQuestions(response.data);
    } catch (error) {
      console.error('Error fetching data for refresh:', error);
    }
  }, []);
  
  useEffect(() => {
    refresh();
  }, [refresh]);  

  useEffect(() => {
    // Fetch questions based on selected program and competency
    if (selectedProgram || selectedCompetency) {
      axios
        .get(
          `http://localhost:3001/filter/filterQuestions?programs=${selectedProgram?.label || ''}&competency=${selectedCompetency?.label || ''}`
        )
        .then((response) => {
          setCurrentGame(response.data);
          setMaxQuestions(response.data.length);
          setCurrentQuestion(0);
          setSelectedChoices(Array(response.data.length).fill(-1));
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // If no program or competency is selected, use all questions
      getGameData();
    }
  }, [selectedProgram, selectedCompetency]);
  

  const renderQuestions = () => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = Math.min(
      startIndex + questionsPerPage,
      maxQuestions
    );
  
    if (!filteredQuestions || filteredQuestions.length === 0) {
      // Handle the case when filteredQuestions is empty or not yet loaded
      return (
        <div className="text-center">
          Loading questions...
        </div>
      );
    }
  
    return filteredQuestions
      .slice(startIndex, endIndex)
      .map((question, index) => (
        <div
          key={index}
          className="border-2 shadow-lg items-center justify-center my-2"
        >
          {/* Render each question component */}
          <div className="text-xl text-center dark:text-white btn-primary">
            Question {startIndex + index + 1}/{maxQuestions}
          </div>
          <div className="p-3 dark:text-white text-2xl text-center">
            {question.questionText}
          </div>
          <div id="answers-container" className="p-3">
            {question.choices.map((choice, answerIndex) => (
                <div
                key={answerIndex}
                className={`container btn-container items-center flex border border-gray-700 mb-2 rounded-3xl cursor-pointer ${
                  selectedChoices[startIndex + index] === answerIndex // Check if the choice index matches the selected choice
                    ? "bg-blue-500 text-white" // Apply bg-blue-500 and text-white when selected
                    : ""
                }`}
                onClick={(el) => updateScore(answerIndex, index, el)}
              >
                <div className="dark:text-white py-2 px-4 bg-gray-700 text-white font-bold text-lg rounded-3xl m-1 shadow-md btn-primary">
                  {String.fromCharCode(65 + answerIndex)}
                </div>
                <div className="dark:text-white py-2 px-4 text-gray-700 font-semibold">
                  {choice.choiceText}
                </div>
              </div>
            ))}
          </div>
          
        </div>
      ));
  };
  
  // ...
  
  
  const totalPages = Math.ceil(maxQuestions / questionsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const previousPage = () => {
    goToPage(currentPage - 1);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const programOptions = [
    { value: 'social_work', label: 'Social Work' },
    { value: 'option', label: 'Option' },
  ];

  const competencyOptions = [
    { value: 'human_behavior', label: 'Human Behavior and Social Environment' },
    { value: 'social_case_work', label: 'Social Case Work' },
  ];
  const handleStartExam = () => {
    const currentStartTime = new Date(); // Capture the current date and time
    // Other code to start the exam
  };
  
  return (
    <div className="container min-h-screen h-auto items flex flex-col">
      <div className="flex flex-col lg:flex-row text-center py-4 header-bg shadow-md text-lg font-semibold dark:text-white">
  <div className="flex flex-col lg:flex-row gap-8 justify-center items-center mx-auto dark:text-white">
    <div className="mb-4 lg:w-72">
      <Select
        placeholder="Program"
        id="program"
        name="program"
        value={selectedProgram}
        onChange={(selectedOption) => setSelectedProgram(selectedOption)}
        options={programOptions}
      />
    </div>

    <div className="mb-4 lg:w-72">
      <Select
        placeholder="Competency"
        id="competency"
        name="competency"
        value={selectedCompetency}
        onChange={(selectedOption) => setSelectedCompetency(selectedOption)}
        options={competencyOptions}
      />
    </div>
      <Countdown handleStartExam={handleStartExam}/> 
  </div>
</div>

      {currentQuestion !== maxQuestions ? (
        <>
          {renderQuestions()}
          <div className="container text-center header-bg p-2 text-gray-800 mt-auto">
          <div className="flex justify-center mx-auto dark:text-white">
          <button
            className="relative block rounded bg-primary-100 px-3 py-1.5 text-xl font-medium text-primary-700 transition-all duration-300"
            onClick={submitExam}
          >
            Submit
          </button>
          </div>
            <h2 className="text-2xl pb-1 border-b text-gray-900 dark:text-white border-gray-500">
              Questions remaining: 
            </h2>
          </div>
          <div className="container flex justify-center p-4 header-bg dark:text-white">
          <ul className="list-style-none flex">
              <li>
                {currentPage > 1 && (
                  <button
                    className="relative block rounded bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-700 transition-all duration-300"
                    onClick={previousPage}
                  >
                    Previous
                  </button>
                )}
              </li>
              {Array.from({ length: totalPages }, (v, i) => (
                <li key={i}>
                  <button
                    className={`relative block rounded bg-transparent px-3 py-1.5 text-sm ${
                      i + 1 === currentPage
                        ? "font-medium text-primary-700 bg-primary-100"
                        : "text-neutral-600"
                    } transition-all duration-300`}
                    onClick={() => goToPage(i + 1)}
                  >
                    {i + 1}
                    {i + 1 === currentPage && (
                      <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
                        (current)
                      </span>
                    )}
                  </button>
                </li>
              ))}
              <li>
                {currentPage < totalPages && (
                  <button
                    className="relative block rounded bg-primary-100 dark:text-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-all duration-300"
                    onClick={nextPage}
                  >
                    Next
                  </button>
                )}
              </li>
            </ul>
          </div>
        </>
      ) : (
        EndExam()
      )}
    </div>
  );
}

export default Exam;