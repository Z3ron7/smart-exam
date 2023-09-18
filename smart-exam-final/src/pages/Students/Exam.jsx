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
  const [selectedCountdown, setSelectedCountdown] = useState(null);
  const [selectedChoices, setSelectedChoices] = useState(Array(maxQuestions).fill(-1));
  const [startTime, setStartTime] = useState(null);
const [endTime, setEndTime] = useState(null);

  const questionsPerPage = 5;


  const getGameData = () => {
    axios.get('http://localhost:3001/questions/fetch')
      .then((response) => {
        // Assuming that the response contains an array of questions
        setCurrentGame(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  

  useEffect(() => {
    getGameData();
  }, [currentGamePlaying]);

  const updateScore = (answer_index, el) => {
    if (currentQuestion >= maxQuestions || !currentGame || currentQuestion >= currentGame.length) {
      return; // Handle or display end game logic here
    }
    
    const question = currentGame[currentQuestion];

    setSelectedChoices((prevChoices) => {
      const updatedChoices = [...prevChoices];
      updatedChoices[currentQuestion] = answer_index;
      return updatedChoices;
    });

    if (answer_index === question.correct) {
      // Apply a class for a correct answer
      el.target.classList.add("correct-answer");
    } else {
      // Apply a class for a wrong answer
      el.target.classList.add("wrong-answer");
    }
  
    // You can remove any previous classes if needed
    // el.target.classList.remove("correct-answer");
    // el.target.classList.remove("wrong-answer");
  
    console.log(playerScore);
    const updatedSelectedChoices = [...selectedChoices];
    updatedSelectedChoices[currentQuestion] = answer_index;
    setSelectedChoices(updatedSelectedChoices);
  
    // Increment the current question
    setCurrentQuestion(currentQuestion + 1);
  };
  
  const submitExam = () => {
    // Prepare exam results data to send to the backend
    const currentEndTime = new Date(); // Capture the current date and time
    setEndTime(currentEndTime);
    const examResults = currentGame.map((question, index) => ({
      question_id: question.id, // Use the actual question ID from your data
      selected_choice: selectedChoices[index],
    }));
  
    // Check if endTime is not null before calling toISOString
    const endTimeISO = endTime ? endTime.toISOString() : null;
  
    // Send the exam results to the backend
    axios
      .post("http://localhost:3001/exams/exams/submit", {
        examResults,
        totalScore: playerScore,
        startTime: startTime.toISOString(), // Convert to ISO format for consistency
        endTime: endTimeISO, // Use the ISO format or null if endTime is null
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
      axios.get(`http://localhost:3001/questions/fetch?program=${selectedProgram?.value || ''}&competency=${selectedCompetency?.value || ''}`)
        .then((response) => {
          setFilteredQuestions(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // If no program or competency is selected, use all questions
      setFilteredQuestions(currentGame);
    }
  }, [selectedProgram, selectedCompetency, currentGame]);

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
                 selectedChoices[currentQuestion] === answerIndex
                   ? "bg-black text-white" // Apply bg-dark and text-white when selected
                   : ""
               }`}
               onClick={(el) => updateScore(answerIndex, el)}
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
      <Countdown /> 
  </div>
</div>

      {currentQuestion !== maxQuestions ? (
        <>
          {renderQuestions()}
          <div className="container text-center header-bg p-2 text-white mt-auto">
          <div className="flex justify-center mx-auto dark:text-white">
          <button
            className="relative block rounded bg-primary-100 px-3 py-1.5 text-xl font-medium text-primary-700 transition-all duration-300"
            onClick={submitExam}
          >
            Submit
          </button>
          </div>
            <h2 className="text-2xl pb-1 border-b border-gray-500">
              Questions remaining: 
            </h2>
          </div>
          <div className="container flex justify-center p-4 header-bg text-white">
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
                    className="relative block rounded bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-700 transition-all duration-300"
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