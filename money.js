class MoneyComprehensionGame {
    constructor() {
        this.currentQuestion = 1;
        this.score = 0;
        this.questions = [];
        this.currentAnswer = 0;
        this.userAnswers = [];
        this.difficulty = 'easy';
        this.startTime = null;

        this.tablesSelection = document.querySelector('.tables-selection');
        this.exerciseContainer = document.querySelector('.exercise-container');
        this.resultsContainer = document.querySelector('.results');
        this.currentQuestionSpan = document.getElementById('currentQuestion');
        this.answerInput = document.getElementById('answer');
        this.scenarioText = document.getElementById('scenarioText');
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
            if ((value === ',' || value === '.') && (this.answerInput.value.includes(',') || this.answerInput.value.includes('.'))) {
                return;
            }

            this.answerInput.value += value;
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

    toCents(amount) {
        return Math.round(amount * 100);
    }

    formatAmount(amount) {
        return amount.toFixed(2).replace('.', ',');
    }

    randomChoice(values) {
        const index = Math.floor(Math.random() * values.length);
        return values[index];
    }

    generateQuestion() {
        const settings = {
            easy: {
                prices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                payments: [5, 10, 20]
            },
            medium: {
                prices: [1.2, 1.5, 2.3, 2.75, 3.6, 4.2, 5.4, 6.8, 7.25, 8.5],
                payments: [5, 10, 20]
            },
            hard: {
                prices: [3.45, 5.6, 7.85, 9.9, 12.4, 14.75, 16.2, 18.95, 21.3, 24.8],
                payments: [20, 50]
            }
        };

        const config = settings[this.difficulty];
        let price = this.randomChoice(config.prices);
        let paid = this.randomChoice(config.payments);

        while (price >= paid) {
            price = this.randomChoice(config.prices);
            paid = this.randomChoice(config.payments);
        }

        const change = this.toCents(paid) - this.toCents(price);

        return {
            price,
            paid,
            answerCents: change,
            scenario: `Un article coûte ${this.formatAmount(price)} €. Tu donnes ${this.formatAmount(paid)} €. Quelle monnaie doit-on te rendre ?`
        };
    }

    generateQuestions() {
        this.questions = [];
        for (let i = 0; i < 10; i++) {
            this.questions.push(this.generateQuestion());
        }
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
        this.currentAnswer = question.answerCents;
        this.scenarioText.textContent = question.scenario;

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

    normalizeMoneyInput(input) {
        const sanitized = input.trim().replace('€', '').replace(',', '.');
        if (!/^\d+(\.\d{1,2})?$/.test(sanitized)) {
            return null;
        }

        const value = parseFloat(sanitized);
        if (Number.isNaN(value) || value < 0) {
            return null;
        }

        return this.toCents(value);
    }

    checkAnswer() {
        this.hideMessages();

        const userAnswerCents = this.normalizeMoneyInput(this.answerInput.value);

        if (userAnswerCents === null) {
            this.errorMessage.textContent = 'Format invalide. Exemple : 2,50';
            this.errorMessage.classList.add('show');
            return;
        }

        const question = this.questions[this.currentQuestion - 1];
        const isCorrect = userAnswerCents === this.currentAnswer;

        this.userAnswers.push({
            question: `${this.formatAmount(question.price)} € payés avec ${this.formatAmount(question.paid)} €`,
            userAnswer: this.formatAmount(userAnswerCents / 100),
            correctAnswer: this.formatAmount(this.currentAnswer / 100),
            isCorrect
        });

        if (isCorrect) {
            this.score += 1;
            this.successMessage.textContent = 'Bravo ! Le rendu de monnaie est correct.';
            this.successMessage.classList.add('show');
        } else {
            this.errorMessage.textContent = `Ce n'est pas exact. Il fallait ${this.formatAmount(this.currentAnswer / 100)} €.`;
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
            answerElement.textContent = `${index + 1}. ${answer.question} → ${answer.userAnswer} €${answer.isCorrect ? '' : ` (Réponse attendue : ${answer.correctAnswer} €)`}`;
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
    new MoneyComprehensionGame();
});
