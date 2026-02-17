class ProbabilityGame {
    constructor() {
        this.currentQuestion = 1;
        this.score = 0;
        this.questions = [];
        this.currentAnswer = null;
        this.userAnswers = [];
        this.difficulty = 'easy';
        this.startTime = null;

        this.tablesSelection = document.querySelector('.tables-selection');
        this.exerciseContainer = document.querySelector('.exercise-container');
        this.resultsContainer = document.querySelector('.results');
        this.currentQuestionSpan = document.getElementById('currentQuestion');
        this.eventText = document.getElementById('eventText');
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
        document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
            radio.addEventListener('change', (event) => {
                this.difficulty = event.target.value;
            });
        });

        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restart());

        this.keypad.addEventListener('click', (event) => {
            if (!event.target.classList.contains('key')) {
                return;
            }
            if (event.target.classList.contains('delete')) {
                this.answerInput.value = this.answerInput.value.slice(0, -1);
                return;
            }
            this.answerInput.value += event.target.textContent;
        });

        this.validateButton.addEventListener('click', () => {
            if (this.answerInput.value !== '') {
                this.checkAnswer();
            }
        });

        this.nextButton.addEventListener('click', () => this.nextQuestion());

        this.answerInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && this.answerInput.value !== '') {
                this.checkAnswer();
            }
        });
    }

    getDenominatorPool() {
        const pools = {
            easy: [2, 4, 5, 10],
            medium: [4, 5, 10, 20, 25],
            hard: [4, 5, 10, 20, 25, 50, 100]
        };
        return pools[this.difficulty];
    }

    buildQuestion() {
        const denominatorPool = this.getDenominatorPool();
        const total = denominatorPool[Math.floor(Math.random() * denominatorPool.length)];
        const favorable = Math.floor(Math.random() * (total + 1));
        const answer = Math.round((favorable / total) * 100);

        const contexts = [
            `Dans un sac il y a ${favorable} billes rouges sur ${total} billes. Probabilité de tirer une rouge`,
            `Une roue est divisée en ${total} parts égales dont ${favorable} gagnantes. Probabilité de tomber sur une part gagnante`,
            `Dans une boîte, ${favorable} cartes sont marquées "A" sur ${total} cartes. Probabilité de tirer "A"`
        ];

        return {
            text: contexts[Math.floor(Math.random() * contexts.length)],
            answer
        };
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
            this.questions.push(this.buildQuestion());
        }
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion - 1];
        this.eventText.textContent = `${question.text} = `;
        this.currentAnswer = question.answer;
        this.answerInput.value = '';
        this.answerInput.disabled = false;
        this.answerInput.focus();
        this.hideMessages();
        this.validateButton.classList.remove('hidden');
        this.nextButton.classList.add('hidden');
    }

    hideMessages() {
        this.errorMessage.classList.remove('show');
        this.successMessage.classList.remove('show');
    }

    checkAnswer() {
        const userAnswer = parseInt(this.answerInput.value, 10);
        this.hideMessages();

        const question = this.questions[this.currentQuestion - 1];
        const isCorrect = userAnswer === this.currentAnswer;
        this.userAnswers.push({
            question: question.text,
            userAnswer,
            correctAnswer: this.currentAnswer,
            isCorrect
        });

        if (isCorrect) {
            this.score++;
            this.successMessage.textContent = 'Bravo ! C\'est correct !';
            this.successMessage.classList.add('show');
        } else {
            this.errorMessage.textContent = `Dommage ! La réponse était ${this.currentAnswer}%`;
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
            return;
        }
        this.showResults();
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
            questionSpan.textContent = `${index + 1}. ${answer.question} = `;

            const userAnswerSpan = document.createElement('span');
            userAnswerSpan.className = 'user-answer';
            userAnswerSpan.textContent = `${answer.userAnswer}%`;

            answerElement.appendChild(questionSpan);
            answerElement.appendChild(userAnswerSpan);

            if (!answer.isCorrect) {
                const correctAnswerSpan = document.createElement('span');
                correctAnswerSpan.className = 'correct-answer';
                correctAnswerSpan.textContent = `(La bonne réponse était ${answer.correctAnswer}%)`;
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
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProbabilityGame();
});
