class ComplementGame {
    constructor() {
        this.currentQuestion = 1;
        this.score = 0;
        this.questions = [];
        this.currentAnswer = null;
        this.userAnswers = [];
        this.target = 10;
        this.startTime = null;

        this.tablesSelection = document.querySelector('.tables-selection');
        this.exerciseContainer = document.querySelector('.exercise-container');
        this.resultsContainer = document.querySelector('.results');
        this.currentQuestionSpan = document.getElementById('currentQuestion');
        this.num1Span = document.getElementById('num1');
        this.targetValueSpan = document.getElementById('targetValue');
        this.answerInput = document.getElementById('answer');
        this.scoreSpan = document.getElementById('score');
        this.timeSpan = document.getElementById('time');
        this.errorMessage = document.getElementById('errorMessage');
        this.successMessage = document.getElementById('successMessage');
        this.answersList = document.getElementById('answersList');
        this.validateButton = document.getElementById('validateButton');
        this.nextButton = document.getElementById('nextButton');
        this.progressFill = document.getElementById('progressFill');

        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.keypad = document.querySelector('.keypad');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.querySelectorAll('input[name="target"]').forEach((radio) => {
            radio.addEventListener('change', (event) => {
                this.target = parseInt(event.target.value, 10);
            });
        });

        this.startButton.addEventListener('click', () => {
            this.startGame();
        });

        this.restartButton.addEventListener('click', () => {
            this.restart();
        });

        this.keypad.addEventListener('click', (event) => {
            const key = event.target.closest('.key');
            if (!key || this.answerInput.disabled) {
                return;
            }

            if (key.classList.contains('delete')) {
                this.answerInput.value = this.answerInput.value.slice(0, -1);
                return;
            }

            this.answerInput.value += key.textContent;
        });

        this.validateButton.addEventListener('click', () => {
            if (this.answerInput.value !== '') {
                this.checkAnswer();
            }
        });

        this.nextButton.addEventListener('click', () => {
            this.nextQuestion();
        });

        this.answerInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && this.answerInput.value !== '') {
                this.checkAnswer();
            }
        });
    }

    getRandomNumber() {
        return Math.floor(Math.random() * (this.target + 1));
    }

    startGame() {
        this.tablesSelection.classList.add('hidden');
        this.exerciseContainer.classList.remove('hidden');
        this.generateQuestions();
        this.showQuestion();
        this.startTime = Date.now();
    }

    generateQuestions() {
        this.questions = [];
        for (let i = 0; i < 10; i++) {
            const num1 = this.getRandomNumber();
            this.questions.push({
                num1,
                target: this.target,
                answer: this.target - num1
            });
        }
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion - 1];
        this.num1Span.textContent = question.num1;
        this.targetValueSpan.textContent = question.target;
        this.currentAnswer = question.answer;
        this.answerInput.value = '';
        this.answerInput.focus();
        this.hideMessages();
        this.validateButton.classList.remove('hidden');
        this.nextButton.classList.add('hidden');
        this.answerInput.disabled = false;
    }

    hideMessages() {
        this.errorMessage.classList.remove('show');
        this.successMessage.classList.remove('show');
    }

    checkAnswer() {
        const userAnswer = parseInt(this.answerInput.value, 10);
        this.hideMessages();

        const currentQuestionData = this.questions[this.currentQuestion - 1];

        this.userAnswers.push({
            question: `${currentQuestionData.num1} + ? = ${currentQuestionData.target}`,
            userAnswer,
            correctAnswer: this.currentAnswer,
            isCorrect: userAnswer === this.currentAnswer
        });

        if (userAnswer === this.currentAnswer) {
            this.score++;
            this.successMessage.textContent = 'Bravo ! C\'est correct !';
            this.successMessage.classList.add('show');
        } else {
            this.errorMessage.textContent = `Dommage ! La réponse était ${this.currentAnswer}`;
            this.errorMessage.classList.add('show');
        }

        this.validateButton.classList.add('hidden');
        this.nextButton.classList.remove('hidden');
        this.answerInput.disabled = true;
    }

    nextQuestion() {
        if (this.currentQuestion < 10) {
            this.currentQuestion++;
            this.currentQuestionSpan.textContent = this.currentQuestion;
            this.progressFill.style.width = `${(this.currentQuestion - 1) * 10}%`;
            this.showQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        this.exerciseContainer.classList.add('hidden');
        this.resultsContainer.classList.remove('hidden');

        const endTime = Date.now();
        const timeElapsed = Math.floor((endTime - this.startTime) / 1000);
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;

        this.scoreSpan.textContent = this.score;
        this.timeSpan.textContent = `${minutes} min ${seconds}`;

        this.displayDetailedResults();
    }

    displayDetailedResults() {
        this.answersList.innerHTML = '';

        this.userAnswers.forEach((answer, index) => {
            const answerElement = document.createElement('div');
            answerElement.className = `answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;

            const questionSpan = document.createElement('span');
            questionSpan.className = 'question';
            questionSpan.textContent = `${index + 1}. ${answer.question} → ${answer.userAnswer}`;

            answerElement.appendChild(questionSpan);

            if (!answer.isCorrect) {
                const correctAnswerSpan = document.createElement('span');
                correctAnswerSpan.className = 'correct-answer';
                correctAnswerSpan.textContent = `(Réponse attendue : ${answer.correctAnswer})`;
                answerElement.appendChild(correctAnswerSpan);
            }

            this.answersList.appendChild(answerElement);
        });
    }

    restart() {
        this.currentQuestion = 1;
        this.score = 0;
        this.userAnswers = [];
        this.currentQuestionSpan.textContent = this.currentQuestion;
        this.progressFill.style.width = '0%';
        this.tablesSelection.classList.remove('hidden');
        this.exerciseContainer.classList.add('hidden');
        this.resultsContainer.classList.add('hidden');

        const defaultTarget = document.querySelector('input[name="target"][value="10"]');
        if (defaultTarget) {
            defaultTarget.checked = true;
            this.target = 10;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ComplementGame();
});
