import { useEffect, useState } from "react";
import { Select, Option } from "@material-tailwind/react";

function Exam() {
  const [currentGame, setCurrentGame] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [currentGamePlaying, setCurrentGamePlaying] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const questionsPerPage = 5;

  const getGameData = async () => {
    let res = await fetch(
      "https://raw.githubusercontent.com/aaronnech/Who-Wants-to-Be-a-Millionaire/master/questions.json"
    );
    let data = await res.json();
    await setCurrentGame(data.games[0]?.questions);
  };

  useEffect(() => {
    getGameData();
  }, [currentGamePlaying]);

  const updateScore = (answer_index, el) => {
    if (currentQuestion >= maxQuestions) return; // change this to display end game scene
    if (answer_index === currentGame[currentQuestion].correct) {
      setPlayerScore((current_score) => current_score + 1000);
      el.target.classList.add("correct");
    } else {
      el.target.classList.add("wrong");
    }
    setTimeout(() => {
      setCurrentQuestion((current_question) => current_question + 1);
      el.target.classList.remove("correct");
      el.target.classList.remove("wrong");
    }, 1000);
    console.log(playerScore);
  };

  const endGameScreen = () => (
    <>
      {playerScore >= 8000 ? (
        <>
          <div className="container text-center p-2 text-white mt-auto header-bg">
            <h2 className="text-2xl pb-1 border-b border-gray-500">
              Bank: ${playerScore}
            </h2>
            <h4 className="text-lg">
              Get $8000 to advance to the next round.
            </h4>
          </div>
          <div className="mb-auto p-6 header-bg">
            <h2 className="font-bold text-lg">You Advanced To Next Round</h2>
            <p>
              You can keep playing to stand to win the cash price of $20 000.
              Answer the next 5 questions.
            </p>
            <p>What will you do?</p>
            <div className="flex p-3 text-white">
              <div className="py-2 px-5 cursor-pointer btn-primary rounded-xl mr-3">
                Cash Out
              </div>
              <div className="py-2 px-5 cursor-pointer bg-green-500 rounded-xl"  onClick={() => setCurrentGamePlaying((current) => current + 1)}>
                Keep playing
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="my-auto p-6 header-bg">
          <h2 className="font-bold text-lg">You Did Not Advance</h2>
          <p>
            It seems like you are lacking in general knowledge... Your welcome
            to play again
          </p>
          <div className="flex p-3 text-white">
            <div
              className="py-2 px-5 cursor-pointer bg-green-500 rounded-xl mr-3"
              onClick={() => setCurrentGamePlaying((current) => current + 1)}
            >
              Play Again
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderQuestions = () => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = Math.min(
      startIndex + questionsPerPage,
      maxQuestions
    );

    return currentGame.slice(startIndex, endIndex).map((question, index) => (
      <div
        key={index}
        className="border-2 shadow-lg items-center justify-center my-2  "
      >
        <div className="text-xl text-center dark:text-white btn-primary">
          Question {startIndex + index + 1}/{maxQuestions}
        </div>
        <div className="p-3 dark:text-white text-2xl text-center">{question?.question}</div>
        <div id="answers-container" className="p-3">
          {question?.content.map((answer, answerIndex) => (
            <div
              key={answerIndex}
              className="container btn-container items-center flex border border-gray-700 mb-2 rounded-3xl cursor-pointer"
              onClick={(el) => updateScore(answerIndex, el)}
            >
              <div className="dark:text-white py-2 px-4 bg-gray-700 text-white font-bold text-lg rounded-3xl m-1 shadow-md btn-primary">
                {String.fromCharCode(65 + answerIndex)}
              </div>
              <div className="dark:text-white py-2 px-4 text-gray-700 font-semibold">{answer}</div>
            </div>
          ))}
        </div>
      </div>
    ));
  };
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

  return (
    <div className="container min-h-screen h-auto items flex flex-col">
      <div className="flex text-center py-4 header-bg shadow-md text-lg font-semibold dark:text-white ">
        
      <div className="w-72">
      <Select label="Select Version">
        <Option>Material Tailwind HTML</Option>
        <Option>Material Tailwind React</Option>
        <Option>Material Tailwind Vue</Option>
        <Option>Material Tailwind Angular</Option>
        <Option>Material Tailwind Svelte</Option>
      </Select>
    </div>
      </div>
      {currentQuestion !== maxQuestions ? (
        <>
          {renderQuestions()}
          <div className="container text-center header-bg p-2 text-white mt-auto">
            <h2 className="text-2xl pb-1 border-b border-gray-500">
              Bank: ${playerScore}
            </h2>
            <h4 className="text-lg">
              Get $8000 to advance to the next question.
            </h4>
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
        endGameScreen()
      )}
    </div>
  );
}

export default Exam;
