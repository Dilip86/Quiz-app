document.addEventListener("DOMContentLoaded", function () {
  const questionContainer = document.getElementById("question-container");
  const questionText = document.getElementById("question-text");
  const optionsList = document.getElementById("options");
  const resultContainer = document.getElementById("result-container");
  const resultText = document.getElementById("result-text");
  const score = document.getElementById("score");
  const submittedAnswers = document.getElementById("submitted-answers");

  let quizData = []; // Store the quiz data

  let currentQuestionIndex = 0;
  let userScore = 0;
  let userAnswers = [];

  fetch("./quiz.json")
    .then((response) => response.json())
    .then((data) => {
      quizData = data; // Store the quiz data after fetching
      startQuiz();
    })
    .catch((error) => console.error("Error fetching data:", error));

  function startQuiz() {
    questionContainer.style.display = "block";
    resultContainer.style.display = "none";
    currentQuestionIndex = 0;
    userScore = 0;
    userAnswers = [];
    loadQuestion(currentQuestionIndex);
  }

  function loadQuestion(index) {
    if (index < quizData.length) {
      const question = quizData[index];
      questionText.textContent = question.question;
      optionsList.innerHTML = '';

      question.options.forEach((option, i) => {
        const listItem = document.createElement('li');
        listItem.textContent = option;
        listItem.addEventListener('click', () => checkAnswer(option, index));
        optionsList.appendChild(listItem);
      });

      // Enable or disable the submit button based on whether the question is answered
      const submitButton = document.getElementById('submit-button');
      submitButton.disabled = !userAnswers[index];
    } else {
      showResults();
    }
  }

  function checkAnswer(selectedOption, questionIndex) {
    const correctAnswer = quizData[questionIndex].answer;
    if (!userAnswers[questionIndex]) {
      userAnswers[questionIndex] = selectedOption;
  
      // Highlight the selected answer
      const answerItems = optionsList.getElementsByTagName("li");
      for (let i = 0; i < answerItems.length; i++) {
        answerItems[i].classList.remove("selected-answer");
        if (answerItems[i].textContent === selectedOption) {
          if (selectedOption === correctAnswer) {
            answerItems[i].classList.add("correct-answer");
          } else {
            answerItems[i].classList.add("wrong-answer");
          }
        }
      }
    }
  
    // Disable options after selecting an answer
    const answerItems = optionsList.getElementsByTagName("li");
    for (let i = 0; i < answerItems.length; i++) {
      answerItems[i].classList.add("disabled");
      answerItems[i].removeEventListener("click", checkAnswer);
    }
  
    // Increment the currentQuestionIndex and load the next question
    currentQuestionIndex++;
    loadQuestion(currentQuestionIndex);
  }
  
  
  

  function submitAnswer() {
    userAnswers[currentQuestionIndex] = userAnswers[currentQuestionIndex] || ''; // Ensure an answer is submitted
    currentQuestionIndex++;
    
    // Re-enable options for the next question
    const answerItems = optionsList.getElementsByTagName('li');
    for (let i = 0; i < answerItems.length; i++) {
      answerItems[i].classList.remove('disabled');
      answerItems[i].addEventListener('click', () => checkAnswer(answerItems[i].textContent, currentQuestionIndex));
    }
    
    loadQuestion(currentQuestionIndex);
  }

  function showResults() {
    questionContainer.style.display = "none";
    resultContainer.style.display = "block";
    let correctAnswersCount = 0;
  
    // Display submitted answers and correct answers
    let submittedAnswersText = "Your Submitted Answers and Correct Answers:\n";
    for (let i = 0; i < quizData.length; i++) {
      const userAnswer = userAnswers[i] || "Not Submitted";
      const correctAnswer = quizData[i].answer;
  
      submittedAnswersText += `Question ${i + 1}:\n`;
      submittedAnswersText += `Your Answer: ${userAnswer}\n`;
      submittedAnswersText += `Correct Answer: ${correctAnswer}\n\n`;
  
      if (userAnswer === correctAnswer) {
        correctAnswersCount++;
      }
    }
    submittedAnswers.textContent = submittedAnswersText;
  
    score.textContent = `Your Score: ${correctAnswersCount} / ${quizData.length}`;
  }
  
  startQuiz();
});
