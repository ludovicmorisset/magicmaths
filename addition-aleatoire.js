class JeuAdditionAleatoire {
    constructor() {
        this.currentQuestion = 1;
        this.score = 0;
        this.questions = [];
        this.currentAnswer = null;
        this.userAnswers = [];
        this.difficulty = 'facile';
        this.startTime = null;

        // Éléments DOM
        this.tablesSelection = document.querySelector('.tables-selection');
        this.exerciseContainer = document.querySelector('.exercise-container');
        this.resultsContainer = document.querySelector('.results');
        this.currentQuestionSpan = document.getElementById('currentQuestion');
        this.num1Span = document.getElementById('num1');
        this.num2Span = document.getElementById('num2');
        this.answerInput = document.getElementById('answer');
        this.scoreSpan = document.getElementById('score');
        this.timeSpan = document.getElementById('time');
        this.errorMessage = document.getElementById('errorMessage');
        this.successMessage = document.getElementById('successMessage');
        this.answersList = document.getElementById('answersList');
        this.validateButton = document.getElementById('validateButton');
        this.nextButton = document.getElementById('nextButton');
        this.progressFill = document.getElementById('progressFill');

        // Boutons
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');

        // Pavé numérique
        this.keypad = document.querySelector('.keypad');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Gestion de la difficulté
        document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.difficulty = e.target.value;
            });
        });

        // Bouton de démarrage
        this.startButton.addEventListener('click', () => this.startGame());

        // Recommencer
        this.restartButton.addEventListener('click', () => this.restart());

        // Gestion du pavé numérique
        this.keypad.addEventListener('click', (e) => {
            if (e.target.classList.contains('key')) {
                if (e.target.classList.contains('delete')) {
                    this.answerInput.value = this.answerInput.value.slice(0, -1);
                } else {
                    this.answerInput.value += e.target.textContent;
                }
            }
        });

        // Bouton de validation
        this.validateButton.addEventListener('click', () => {
            if (this.answerInput.value !== '') {
                this.checkAnswer();
            }
        });

        // Bouton suivant
        this.nextButton.addEventListener('click', () => {
            this.nextQuestion();
        });

        // Touche Entrée pour valider aussi
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.answerInput.value !== '') {
                this.checkAnswer();
            }
        });
    }

    getRandomNumber() {
        const ranges = {
            facile: 10,
            moyen: 50,
            difficile: 100
        };
        return Math.floor(Math.random() * ranges[this.difficulty]);
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
            const num2 = this.getRandomNumber();
            this.questions.push({
                num1: num1,
                num2: num2,
                answer: num1 + num2
            });
        }
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion - 1];
        this.num1Span.textContent = question.num1;
        this.num2Span.textContent = question.num2;
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
        const userAnswer = parseInt(this.answerInput.value);
        this.hideMessages();

        // Enregistrer la réponse de l'utilisateur
        this.userAnswers.push({
            question: `${this.questions[this.currentQuestion - 1].num1} + ${this.questions[this.currentQuestion - 1].num2}`,
            userAnswer: userAnswer,
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

        // Désactiver le bouton valider et afficher le bouton suivant
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
        
        // Calculer le temps total
        const endTime = Date.now();
        const timeElapsed = Math.floor((endTime - this.startTime) / 1000);
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        
        // Afficher le score et le temps
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
            userAnswerSpan.textContent = answer.userAnswer;
            
            const correctAnswerSpan = document.createElement('span');
            correctAnswerSpan.className = 'correct-answer';
            correctAnswerSpan.textContent = answer.isCorrect ? '' : `(La bonne réponse était ${answer.correctAnswer})`;
            
            answerElement.appendChild(questionSpan);
            answerElement.appendChild(userAnswerSpan);
            if (!answer.isCorrect) {
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
        document.querySelectorAll('.difficulty-selection input').forEach(radio => {
            radio.checked = false;
        });
    }
}

// Initialisation du jeu
document.addEventListener('DOMContentLoaded', () => {
    new JeuAdditionAleatoire();
});
