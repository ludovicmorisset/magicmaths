class JeuLectureHeure {
    constructor() {
        this.currentQuestion = 1;
        this.score = 0;
        this.questions = [];
        this.currentAnswer = '';
        this.userAnswers = [];
        this.difficulty = 'facile';
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
        this.timePeriodIndicator = document.getElementById('timePeriodIndicator');

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
            facile: 60,
            moyen: 15,
            difficile: 5
        };

        return steps[this.difficulty];
    }

    formatTime(hours, minutes) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    getPeriodLabel(hours) {
        return hours < 12 ? 'Matin (AM)' : 'Après-midi / Soir (PM)';
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
        const hourValue = hours % 12;
        const minuteAngle = (minutes / 60) * 360;
        const hourAngle = (hourValue / 12) * 360 + (minutes / 60) * 30;
        const minuteRadians = (minuteAngle - 90) * (Math.PI / 180);
        const hourRadians = (hourAngle - 90) * (Math.PI / 180);

        const minuteHandX = 120 + Math.cos(minuteRadians) * 72;
        const minuteHandY = 120 + Math.sin(minuteRadians) * 72;
        const hourHandX = 120 + Math.cos(hourRadians) * 48;
        const hourHandY = 120 + Math.sin(hourRadians) * 48;

        const markers = Array.from({ length: 12 }, (_, index) => {
            const markerRadians = ((index * 30) - 90) * (Math.PI / 180);
            const outerX = 120 + Math.cos(markerRadians) * 95;
            const outerY = 120 + Math.sin(markerRadians) * 95;
            const innerRadius = index % 3 === 0 ? 82 : 88;
            const innerX = 120 + Math.cos(markerRadians) * innerRadius;
            const innerY = 120 + Math.sin(markerRadians) * innerRadius;
            const width = index % 3 === 0 ? 4 : 2;
            return `<line x1="${innerX.toFixed(2)}" y1="${innerY.toFixed(2)}" x2="${outerX.toFixed(2)}" y2="${outerY.toFixed(2)}" stroke="#2f2f2f" stroke-width="${width}" stroke-linecap="round"/>`;
        }).join('');

        const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="img" aria-label="Horloge indiquant ${this.formatTime(hours, minutes)}"><rect width="240" height="240" rx="24" fill="#ffffff"/><circle cx="120" cy="120" r="96" fill="#f9fbff" stroke="#1a73e8" stroke-width="6"/>${markers}<line x1="120" y1="120" x2="${hourHandX.toFixed(2)}" y2="${hourHandY.toFixed(2)}" stroke="#1a73e8" stroke-width="8" stroke-linecap="round"/><line x1="120" y1="120" x2="${minuteHandX.toFixed(2)}" y2="${minuteHandY.toFixed(2)}" stroke="#d93025" stroke-width="5" stroke-linecap="round"/><circle cx="120" cy="120" r="7" fill="#2f2f2f"/></svg>`;

        this.clockImage.src = `data:image/svg+xml;utf8,${encodeURIComponent(clockSvg)}`;
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
        this.timePeriodIndicator.textContent = this.getPeriodLabel(question.hours);

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
            radio.checked = radio.value === 'facile';
        });
        this.difficulty = 'facile';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new JeuLectureHeure();
});
