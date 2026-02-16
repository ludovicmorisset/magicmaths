class TimeComprehensionGame {
    constructor() {
        this.currentQuestion = 1;
        this.score = 0;
        this.questions = [];
        this.currentAnswer = '';
        this.userAnswers = [];
        this.difficulty = 'easy';
        this.startTime = null;

        this.tablesSelection = document.querySelector('.tables-selection');
        this.exerciseContainer = document.querySelector('.exercise-container');
        this.resultsContainer = document.querySelector('.results');
        this.currentQuestionSpan = document.getElementById('currentQuestion');
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
        this.clockImage = document.getElementById('clockImage');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.querySelectorAll('input[name="difficulty"]').forEach((radio) => {
            radio.addEventListener('change', (e) => {
                this.difficulty = e.target.value;
            });
        });

        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restart());

        this.keypad.addEventListener('click', (e) => {
            if (!e.target.classList.contains('key')) {
                return;
            }

            if (e.target.classList.contains('delete')) {
                this.answerInput.value = this.answerInput.value.slice(0, -1);
                return;
            }

            const value = e.target.textContent;
            if (value === ':' && this.answerInput.value.includes(':')) {
                return;
            }

            if (this.answerInput.value.length < 5) {
                this.answerInput.value += value;
            }
        });

        this.validateButton.addEventListener('click', () => {
            if (this.answerInput.value.trim() !== '') {
                this.checkAnswer();
            }
        });

        this.nextButton.addEventListener('click', () => this.nextQuestion());

        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.answerInput.value.trim() !== '') {
                this.checkAnswer();
            }
        });
    }

    getMinuteStep() {
        const steps = {
            easy: 60,
            medium: 15,
            hard: 5
        };

        return steps[this.difficulty];
    }

    formatTime(hours, minutes) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    generateQuestions() {
        this.questions = [];
        const minuteStep = this.getMinuteStep();

        for (let i = 0; i < 10; i++) {
            const hours = Math.floor(Math.random() * 24);
            const minuteSlot = Math.floor(Math.random() * (60 / minuteStep));
            const minutes = minuteSlot * minuteStep;

            this.questions.push({
                hours,
                minutes,
                answer: this.formatTime(hours, minutes)
            });
        }
    }

    setClockTime(hours, minutes) {
        const clockTime = this.formatTime(hours, minutes).replace(':', 'h');
        this.clockImage.src = `https://randoheure.fr/clock?time=${clockTime}`;
    }

    startGame() {
        this.tablesSelection.classList.add('hidden');
        this.resultsContainer.classList.add('hidden');
        this.exerciseContainer.classList.remove('hidden');
        this.generateQuestions();
        this.showQuestion();
        this.startTime = Date.now();
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion - 1];
        this.currentAnswer = question.answer;
        this.setClockTime(question.hours, question.minutes);

        this.answerInput.value = '';
        this.answerInput.focus();
        this.answerInput.disabled = false;
        this.hideMessages();
        this.validateButton.classList.remove('hidden');
        this.nextButton.classList.add('hidden');
    }

    hideMessages() {
        this.errorMessage.classList.remove('show');
        this.successMessage.classList.remove('show');
    }

    normalizeTimeInput(input) {
        const sanitized = input.trim();
        if (!/^\d{1,2}:\d{2}$/.test(sanitized)) {
            return null;
        }

        const [hoursString, minutesString] = sanitized.split(':');
        const hours = parseInt(hoursString, 10);
        const minutes = parseInt(minutesString, 10);

        if (Number.isNaN(hours) || Number.isNaN(minutes) || hours > 23 || minutes > 59) {
            return null;
        }

        return this.formatTime(hours, minutes);
    }

    checkAnswer() {
        this.hideMessages();

        const normalizedAnswer = this.normalizeTimeInput(this.answerInput.value);
        if (!normalizedAnswer) {
            this.errorMessage.textContent = 'Format invalide. Exemple attendu : 08:30';
            this.errorMessage.classList.add('show');
            return;
        }

        const isCorrect = normalizedAnswer === this.currentAnswer;

        this.userAnswers.push({
            question: `Horloge ${this.currentAnswer}`,
            userAnswer: normalizedAnswer,
            correctAnswer: this.currentAnswer,
            isCorrect
        });

        if (isCorrect) {
            this.score += 1;
            this.successMessage.textContent = 'Bravo ! Bonne lecture de l\'heure.';
            this.successMessage.classList.add('show');
        } else {
            this.errorMessage.textContent = `Ce n\'est pas exact. Il fallait répondre ${this.currentAnswer}.`;
            this.errorMessage.classList.add('show');
        }

        this.validateButton.classList.add('hidden');
        this.nextButton.classList.remove('hidden');
        this.answerInput.disabled = true;
    }

    nextQuestion() {
        if (this.currentQuestion < 10) {
            this.currentQuestion += 1;
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
            answerElement.textContent = `${index + 1}. ${answer.question} → ${answer.userAnswer}${answer.isCorrect ? '' : ` (Réponse attendue : ${answer.correctAnswer})`}`;
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

        document.querySelectorAll('input[name="difficulty"]').forEach((radio) => {
            radio.checked = radio.value === 'easy';
        });
        this.difficulty = 'easy';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TimeComprehensionGame();
});
