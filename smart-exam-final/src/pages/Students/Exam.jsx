import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import classNames from "classnames";
import Select from 'react-select';
import ExamResult from './ExamResult'

function Exam() {
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [score, setScore] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState(Array(maxQuestions).fill(null)); // Adjust the number of questions
  const questionsPerPage = 2; // Adjust the number of questions per page
  const [selectedProgram, setSelectedProgram] = useState({ value: 'Social Work', label: 'Social Work' });
  const [selectedCompetency, setSelectedCompetency] = useState({ value: 'All Competency', label: 'All Competency' });
  const [competencyScores, setCompetencyScores] = useState({});
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const getExamData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/questions/fetch');
      console.log('filter: ', response.data)
      setFilteredQuestions(response.data);
    } catch (error) {
      console.error('Error fetching data for refresh:', error);
    }
  }, []);
  
  useEffect(() => {
    getExamData();
  }, [getExamData]);  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedProgram) {
          let response;
  
          if (selectedCompetency?.value === 'All Competency') {
            // If "All Competency" is selected, fetch questions for all available competencies
            const competencies = ['SWPPS', 'Casework', 'HBSE']; // Replace with your predefined competencies
            const allQuestions = [];
  
            // Fetch questions for each competency and merge the results
            for (const competency of competencies) {
              const competencyResponse = await axios.get(
                `http://localhost:3001/questions/refresh?program=${selectedProgram.label || ''}&competency=${competency}`
              );
  
              // Check if questions already exist in allQuestions array
              for (const question of competencyResponse.data) {
                const existingQuestion = allQuestions.find((q) => q.question_id === question.question_id);
                if (!existingQuestion) {
                  allQuestions.push(question);
                }
              }
            }
            response = { data: allQuestions };
            localStorage.setItem('selectedCompetencyId', 'All');
          } else if (selectedCompetency) {
            // Fetch questions for the selected competency
            response = await axios.get(
              `http://localhost:3001/questions/refresh?program=${selectedProgram.label || ''}&competency=${selectedCompetency.value || ''}`
            );
            localStorage.setItem('selectedCompetencyId', selectedCompetency.value);
          } else {
            // If no competency is selected, use all questions
            await getExamData();
            return; // Exit early to avoid setting state again
          }
          setFilteredQuestions(response.data);
          setMaxQuestions(response.data.length);
          setCurrentQuestion(0);
          setSelectedChoices(Array(response.data.length).fill(-1));
          console.log('filterereQuestion: ', response.data);
            console.log('selectedCompetencyId', selectedCompetency.value);

        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchData();
  }, [selectedProgram, selectedCompetency]);
  
  const nextPage = () => {
    const nextQuestion = currentQuestion + questionsPerPage;
    setCurrentQuestion(nextQuestion);
  };

  const prevPage = () => {
    const prevQuestion = currentQuestion - questionsPerPage;
    setCurrentQuestion(prevQuestion);
  };
// Function to update scores for each competency
const updateCompetencyScore = (competencyId, score) => {
  setCompetencyScores((prevScores) => ({
    ...prevScores,
    [competencyId]: score,
  }));
};

const handleChoiceClick = (choiceIndex, choice, competencyId) => {
  const updatedSelectedChoices = [...selectedChoices];
  updatedSelectedChoices[choiceIndex] = choice;
  setSelectedChoices(updatedSelectedChoices);

  // Calculate the score for the current competency
  const competencyScore = calculateScore(updatedSelectedChoices, competencyId);
  updateCompetencyScore(competencyId, competencyScore);
};


// Function to calculate the score for a specific competency
const calculateScore = () => {
  if (!selectedChoices || !selectedChoices.length) {
    return 0; // Return 0 if selectedChoices is undefined or empty
  }

  let score = 0;
  for (let i = 0; i < selectedChoices.length; i++) {
    const selectedChoice = selectedChoices[i];
    if (selectedChoice && selectedChoice.isCorrect) {
      score++;
    }
  }
  return score;
};

  const resetGame = () => {
    setSelectedChoices(Array(maxQuestions).fill(null)); // Reset selected answers
    setScore(0); // Reset the score
    setCurrentQuestion(0);
    setShowResults(false);
  };
// Define your Select options
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

  const isLastPage = currentQuestion + questionsPerPage >= maxQuestions;
  const isFirstPage = currentQuestion === 0;

  
  return (
    <div className="container min-h-screen h-auto items flex flex-col">
      <div className="flex flex-col lg:flex-row text-center py-4 header-bg shadow-md text-lg font-semibold dark:text-white ">
          <div className="flex flex-col lg:flex-row md:col-4 sm:col-2 gap-5 justify-center items-center mx-auto dark:text-white">
            <div className="mb-4 lg:w-72 md:w-36 sm:w-16 dark:bg-slate-600">
              <Select
                placeholder="Program"
                id="program"
                name="program"
                value={selectedProgram}
                onChange={(selectedOption) => setSelectedProgram(selectedOption)}
                options={programOptions}
              />
            </div>

            <div className="mb-4 lg:w-72 md:w-36 sm:w-16">
              <Select
                placeholder="Competency"
                id="competency"
                name="competency"
                value={selectedCompetency}
                onChange={(selectedOption) => setSelectedCompetency(selectedOption)}
                options={competencyOptions}
              />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4 mx-auto justify-center dark:text-gray-500">Pre-board Exam</h1>

        {!showResults && (
          <div>
            {filteredQuestions.slice(currentQuestion, currentQuestion + questionsPerPage).map((question, index) => (
              <div key={index} className="border-2 dark:border-gray-700 dark:rounded-lg dark:bg-slate-900 shadow-lg items-center justify-center my-2 mb-4">
                <h2 className="text-xl text-center dark:text-white btn-primary">Question {currentQuestion + index + 1}/{maxQuestions}</h2>
                <p className="p-3 dark:text-white text-2xl text-center">{question.questionText}</p>
                <ul className="p-3">
                {question.choices && question.choices.map((choice, choiceIndex) => (
                    <li
                      key={choiceIndex}
                      onClick={() => {
                        // Add the console.log statement here
                        console.log('selectedChoices before update:', selectedChoices);
                        handleChoiceClick(currentQuestion + index, choice);
                        console.log('selectedChoices after update:', selectedChoices);
                      }}
                      className={classNames(
                        "container btn-container items-center flex border border-gray-700 mb-2 rounded-3xl cursor-pointer",
                        {
                          "bg-indigo-700": selectedChoices[currentQuestion + index] === choice,
                        }
                      )}
                    >
                      <div className="dark:text-white py-2 px-4 bg-gray-700 text-white font-bold text-lg rounded-3xl m-1 shadow-md btn-primary">
                  {String.fromCharCode(65 + choiceIndex)}
                </div>
                <div className="dark:text-white py-2 px-4 text-gray-700 font-semibold">
                  {choice.choiceText}
                </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          <div className="container flex justify-center p-4 header-bg dark:text-white">
          <ul className="list-style-none flex">
              <li>
              {!isFirstPage && (
                  <button
                    className="relative block rounded bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-700 transition-all duration-300"
                    onClick={prevPage}
                  >
                    Previous
                  </button>
                )}
              </li>
              
              <li>
               {isLastPage ? (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={() => setShowResults(true)}
                >
                  Finish
                </button>
              ) : (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={nextPage}
                >
                  Next
                </button>
              )}
              </li>
            </ul>
          </div>
          </div>
        )}

{showResults && <ExamResult filteredQuestions={filteredQuestions} selectedChoices={selectedChoices} resetGame={resetGame} />}
    </div>
  );
} 

export default Exam;
