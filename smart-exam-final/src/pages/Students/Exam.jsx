import { useEffect, useState, useCallback, useRef } from "react";
import Select from 'react-select';
import EndExitExam from './EndExam'; 
import axios from 'axios';
import Countdown from './Countdown';


function Exam() {
  const [currentExams, setcurrentExams] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [currentExam, setcurrentExam] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [userExamId, setUserExamId] = useState(null);
  const [examData, setExamData] = useState({
    questions: [],
    selectedChoices: [],
  });
  const initialChoices = Array(currentExams.length).fill(null).map(() => ({
    choiceText: "", // Add other properties as needed
    isUsed: false,  // Initialize isUsed to false
  }));
  const [selectedChoices, setSelectedChoices] = useState(initialChoices);

  const countdownRef = useRef();
  const questionsPerPage = 5;


  const getExamData = useCallback(() => {
    axios
      .get('http://localhost:3001/questions/fetch')
      .then((response) => {
        console.log('Response data:', response.data); // Add this line
        setcurrentExams(response.data);
        setMaxQuestions(response.data.length);
        setCurrentQuestion(0);
        setSelectedChoices(Array(response.data.length).fill(-1));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); // Use an empty dependency array because there are no dependencies
  
  useEffect(() => {
    getExamData();
  }, [getExamData, currentExam]);

  const handleChoiceClick = (questionIndex, choiceIndex, startIndex) => {
    // Make a copy of selectedChoices to avoid mutating the state directly
    const newSelectedChoices = [...selectedChoices];
    newSelectedChoices[startIndex + questionIndex] = choiceIndex;
    setExamData({
      ...examData,
      selectedChoices: newSelectedChoices,
    });
  };
  

  const EndExam = () => {
    return (
      <EndExam
        userScore={userScore}
        questions={currentExams}
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
          setcurrentExams(response.data);
          setMaxQuestions(response.data.length);
          setCurrentQuestion(0);
          setSelectedChoices(Array(response.data.length).fill(-1));
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // If no program or competency is selected, use all questions
      getExamData();
    }
  }, [selectedProgram, selectedCompetency]);
  

  const renderQuestions = () => {
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, maxQuestions);
  const { questions, selectedChoices } = examData;

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
      .map((question, questionIndex) => (
        <div
          key={questionIndex}
          className="border-2 shadow-lg items-center justify-center my-2"
        >
          {/* Render each question component */}
          <div className="text-xl text-center dark:text-white btn-primary">
            Question {startIndex + questionIndex + 1}/{maxQuestions}
          </div>
          <div className="p-3 dark:text-white text-2xl text-center">
            {question.questionText}
          </div>
          <div id="answers-container" className="p-3">
            {question.choices.map((choice, choiceIndex) => (
                <div
                key={choiceIndex}
                className={`container btn-container items-center flex border border-gray-700 mb-2 rounded-3xl cursor-pointer ${
                  selectedChoices[startIndex + questionIndex] === choiceIndex // Check if the choice index matches the selected choice
                    ? "bg-blue-500 text-white" // Apply bg-blue-500 and text-white when selected
                    : ""
                }`}
                onClick={() => handleChoiceClick(questionIndex, choiceIndex)}
              >
                <div className="dark:text-white py-2 px-4 bg-gray-700 text-white font-bold text-lg rounded-3xl m-1 shadow-md btn-primary">
                  {String.fromCharCode(65 + choiceIndex)}
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
    { value: 'Social Work', label: 'Social Work' },
    { value: 'Option', label: 'Option' },
  ];
  
  const competencyOptions = [
    { value: 'All Competency', label: 'All Competency' },
    { value: 'SWPPS', label: 'SWPPS' },
    { value: 'Casework', label: 'Casework' },
    { value: 'HBSE', label: 'HBSE' },
  ];
  
  const user_id = localStorage.getItem('user_id');

  const handleStartExam = (selectedTimeInMinutes) => {
    const currentStartTime = new Date(); // Capture the current date and time

    // Create a user_exam entry in the database
    axios
      .post('http://localhost:3001/exams/user-exams', {
        user_id, // Use the user_id from localStorage
        program_id: selectedProgram ? selectedProgram.value : null, // Use the selected program ID
        competency_id: selectedCompetency ? selectedCompetency.value : null, // Use the selected competency ID
        duration_minutes: selectedTimeInMinutes, // Use the selected time in minutes
        start_time: currentStartTime,
        end_time: null, // Set end_time to null initially
      })
      .then((response) => {
        setUserExamId(response.data.user_exam_id);
        // Start your exam logic here, maybe using userExamId
      })
      .catch((error) => {
        console.error('Error starting exam:', error);
      });
  };

  
  // Helper function to calculate the user's score based on selectedChoices and correct answers
  const calculateUserScore = (selectedChoices, choices) => {
    let userScore = 0;
  
    for (let i = 0; i < selectedChoices.length; i++) {
      const selectedChoiceIndex = selectedChoices[i];
  
      // Check if the selected choice is correct based on the 'is_correct' field
      if (selectedChoiceIndex >= 0 && choices[i].is_correct) {
        userScore++;
      }
    }
  
    return userScore;
  };
  
  // Helper function to calculate the duration in minutes
  const calculateDurationInMinutes = (startTime, endTime) => {
    const timeDifference = endTime - startTime; // Time difference in milliseconds
    const durationMinutes = Math.floor(timeDifference / (1000 * 60)); // Convert to minutes
  
    return durationMinutes;
  };
  const handleEndExamButtonClick = () => {
    // You can add any additional logic here if needed
    // Call the handleEndExam function in Countdown.jsx
    countdownRef.current.handleEndExam();
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
    <Countdown
      ref={countdownRef} // Pass the ref
      handleStartExam={handleStartExam}
      selectedChoices={selectedChoices}
      choices={currentExams.map((question) => question.choices)}
      userId={user_id}
      calculateUserScore={calculateUserScore}
      calculateDurationInMinutes={calculateDurationInMinutes} // Pass the duration calculation function
      handleEndExamButtonClick={handleEndExamButtonClick} // Pass the end exam button click handler
    />
  </div>
</div>

      {currentQuestion !== maxQuestions ? (
        <>
          {renderQuestions()}
          <div className="container text-center header-bg p-2 text-gray-800 mt-auto">
          <div className="flex justify-center mx-auto dark:text-white">
          <button
              onClick={handleEndExamButtonClick}
              className="relative block rounded bg-blue-700 px-3 py-1.5 text-xl font-medium text-gray-700 transition-all duration-300"
            >
              End Exam
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