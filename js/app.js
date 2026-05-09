// Quiz App State
const appState = {
    currentMode: null,
    currentQuestion: 0,
    selectedAnswers: {},
    questions: [],
    filters: {
        year: '',
        subject: '',
        grade: '',
        chapter: ''
    }
};

// Mock Questions Data (Replace with API calls)
const mockQuestions = {
    'fullExam': [
        {
            id: 1,
            question: 'What is the capital of Ethiopia?',
            image: null,
            options: ['Addis Ababa', 'Dire Dawa', 'Harar', 'Mekelle'],
            correct: 0,
            subject: 'Geography',
            year: 2009
        },
        {
            id: 2,
            question: 'Solve: 2x + 5 = 13',
            image: null,
            options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
            correct: 1,
            subject: 'Mathematics',
            year: 2009
        },
        {
            id: 3,
            question: 'Which gas is essential for photosynthesis?',
            image: null,
            options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
            correct: 1,
            subject: 'Biology',
            year: 2009
        }
    ],
    'byGrade': [
        {
            id: 1,
            question: 'Grade 12 Question 1: What is photosynthesis?',
            image: null,
            options: ['Process of respiration', 'Production of glucose using sunlight', 'Breaking down of glucose', 'Movement of water'],
            correct: 1,
            grade: 12,
            subject: 'Biology'
        },
        {
            id: 2,
            question: 'Grade 12 Question 2: Define velocity',
            image: null,
            options: ['Speed only', 'Speed with direction', 'Distance traveled', 'Time taken'],
            correct: 1,
            grade: 12,
            subject: 'Physics'
        }
    ],
    'byChapter': [
        {
            id: 1,
            question: 'Chapter 3, Mathematics: What is the area of a circle with radius 5?',
            image: null,
            options: ['25π', '10π', '5π', '50π'],
            correct: 0,
            chapter: 3,
            subject: 'Mathematics'
        },
        {
            id: 2,
            question: 'Chapter 3, Mathematics: What is the value of sin(90°)?',
            image: null,
            options: ['0', '1', '0.5', '-1'],
            correct: 1,
            chapter: 3,
            subject: 'Mathematics'
        }
    ]
};

// DOM Elements
const modeSelection = document.getElementById('modeSelection');
const selectionPanel = document.getElementById('selectionPanel');
const quizSection = document.getElementById('quizSection');
const resultsSection = document.getElementById('resultsSection');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Mode button listeners
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', selectMode);
    });

    // Navigation buttons
    document.getElementById('backBtn').addEventListener('click', goBack);
    document.getElementById('startBtn').addEventListener('click', startQuiz);
    document.getElementById('prevQuestionBtn').addEventListener('click', previousQuestion);
    document.getElementById('nextQuestionBtn').addEventListener('click', nextQuestion);
    document.getElementById('jumpBtn').addEventListener('click', jumpToQuestion);
    document.getElementById('submitQuizBtn').addEventListener('click', submitQuiz);
    document.getElementById('retryBtn').addEventListener('click', retryQuiz);
    document.getElementById('homeBtn').addEventListener('click', goHome);
    document.getElementById('downloadResultsBtn').addEventListener('click', downloadResults);

    // Grade and Chapter visibility
    document.getElementById('yearSelect').addEventListener('change', updateSelectionForm);
    document.getElementById('subjectSelect').addEventListener('change', updateSelectionForm);
});

// Mode Selection
function selectMode(e) {
    const mode = e.currentTarget.dataset.mode;
    appState.currentMode = mode;
    
    // Update panel title
    const titles = {
        'fullExam': 'Full Exam Practice',
        'byGrade': 'Practice by Grade',
        'byChapter': 'Practice by Chapter'
    };
    
    document.getElementById('panelTitle').textContent = titles[mode];
    updateSelectionForm();
    
    // Show selection panel
    modeSelection.classList.add('hidden');
    selectionPanel.classList.remove('hidden');
}

function updateSelectionForm() {
    const gradeGroup = document.getElementById('gradeGroup');
    const chapterGroup = document.getElementById('chapterGroup');
    
    if (appState.currentMode === 'byGrade') {
        gradeGroup.style.display = 'flex';
        chapterGroup.style.display = 'none';
    } else if (appState.currentMode === 'byChapter') {
        gradeGroup.style.display = 'none';
        chapterGroup.style.display = 'flex';
    } else {
        gradeGroup.style.display = 'none';
        chapterGroup.style.display = 'none';
    }
}

function goBack() {
    modeSelection.classList.remove('hidden');
    selectionPanel.classList.add('hidden');
    quizSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    appState.currentMode = null;
}

function startQuiz() {
    // Validate selections
    const year = document.getElementById('yearSelect').value;
    const subject = document.getElementById('subjectSelect').value;
    
    if (!year || !subject) {
        alert('Please select year and subject');
        return;
    }
    
    appState.filters.year = year;
    appState.filters.subject = subject;
    
    if (appState.currentMode === 'byGrade') {
        const grade = document.getElementById('gradeSelect').value;
        if (!grade) {
            alert('Please select a grade');
            return;
        }
        appState.filters.grade = grade;
    } else if (appState.currentMode === 'byChapter') {
        const chapter = document.getElementById('chapterSelect').value;
        if (!chapter) {
            alert('Please select a chapter');
            return;
        }
        appState.filters.chapter = chapter;
    }
    
    // Load questions (using mock data for now)
    appState.questions = [...mockQuestions[appState.currentMode]];
    appState.currentQuestion = 0;
    appState.selectedAnswers = {};
    
    // Show quiz section
    selectionPanel.classList.add('hidden');
    quizSection.classList.remove('hidden');
    
    // Update quiz info
    const mode = appState.currentMode === 'fullExam' ? 'Full Exam' : 
                 appState.currentMode === 'byGrade' ? 'Grade ' + appState.filters.grade : 
                 'Chapter ' + appState.filters.chapter;
    
    document.getElementById('quizTitle').textContent = `${appState.filters.subject} - ${mode}`;
    document.getElementById('quizSubtitle').textContent = `Year: ${appState.filters.year}`;
    document.getElementById('questionJump').max = appState.questions.length;
    
    displayQuestion();
}

function displayQuestion() {
    const question = appState.questions[appState.currentQuestion];
    
    // Update question display
    document.getElementById('questionNumber').textContent = 
        `Question ${appState.currentQuestion + 1} of ${appState.questions.length}`;
    document.getElementById('questionText').textContent = question.question;
    
    // Handle image
    const imgElement = document.getElementById('questionImage');
    if (question.image) {
        imgElement.src = question.image;
        imgElement.style.display = 'block';
    } else {
        imgElement.style.display = 'none';
    }
    
    // Display options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question-${appState.currentQuestion}`;
        input.value = index;
        
        if (appState.selectedAnswers[appState.currentQuestion] === index) {
            input.checked = true;
            optionDiv.classList.add('selected');
        }
        
        const label = document.createElement('label');
        label.style.cursor = 'pointer';
        label.style.flex = '1';
        label.textContent = String.fromCharCode(65 + index) + '. ' + option;
        
        input.addEventListener('change', (e) => {
            appState.selectedAnswers[appState.currentQuestion] = parseInt(e.target.value);
            updateOptionDisplay();
        });
        
        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        optionsContainer.appendChild(optionDiv);
    });
    
    // Update progress
    updateProgress();
    updateNavigationButtons();
}

function updateOptionDisplay() {
    const options = document.querySelectorAll('.option');
    options.forEach(opt => {
        if (opt.querySelector('input').checked) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
}

function updateProgress() {
    const progress = ((appState.currentQuestion + 1) / appState.questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = 
        `${appState.currentQuestion + 1} / ${appState.questions.length} questions`;
}

function updateNavigationButtons() {
    document.getElementById('prevQuestionBtn').disabled = appState.currentQuestion === 0;
    document.getElementById('nextQuestionBtn').disabled = appState.currentQuestion === appState.questions.length - 1;
}

function nextQuestion() {
    if (appState.currentQuestion < appState.questions.length - 1) {
        appState.currentQuestion++;
        displayQuestion();
        document.querySelector('.question-container').scrollIntoView({ behavior: 'smooth' });
    }
}

function previousQuestion() {
    if (appState.currentQuestion > 0) {
        appState.currentQuestion--;
        displayQuestion();
        document.querySelector('.question-container').scrollIntoView({ behavior: 'smooth' });
    }
}

function jumpToQuestion() {
    const jumpInput = document.getElementById('questionJump');
    const targetQuestion = parseInt(jumpInput.value) - 1;
    
    if (targetQuestion >= 0 && targetQuestion < appState.questions.length) {
        appState.currentQuestion = targetQuestion;
        displayQuestion();
        document.querySelector('.question-container').scrollIntoView({ behavior: 'smooth' });
    } else {
        alert('Invalid question number');
    }
}

function submitQuiz() {
    // Calculate results
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    
    appState.questions.forEach((question, index) => {
        if (appState.selectedAnswers[index] === undefined) {
            unanswered++;
        } else if (appState.selectedAnswers[index] === question.correct) {
            correct++;
        } else {
            incorrect++;
        }
    });
    
    const score = (correct / appState.questions.length) * 100;
    
    // Store results
    appState.results = {
        score: score.toFixed(2),
        correct,
        incorrect,
        unanswered,
        total: appState.questions.length
    };
    
    displayResults();
}

function displayResults() {
    const { score, correct, incorrect, unanswered, total } = appState.results;
    
    // Update score display
    document.getElementById('scoreValue').textContent = score + '%';
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('incorrectCount').textContent = incorrect;
    document.getElementById('unansweredCount').textContent = unanswered;
    
    // Generate review
    const reviewContainer = document.getElementById('reviewContainer');
    reviewContainer.innerHTML = '<h3>Review Your Answers</h3>';
    
    appState.questions.forEach((question, index) => {
        const selectedAnswer = appState.selectedAnswers[index];
        const isCorrect = selectedAnswer === question.correct;
        const isUnanswered = selectedAnswer === undefined;
        
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        if (isUnanswered) {
            reviewItem.classList.add('unanswered');
        } else if (isCorrect) {
            reviewItem.classList.add('correct');
        } else {
            reviewItem.classList.add('incorrect');
        }
        
        let statusText = isUnanswered ? '❌ Unanswered' : isCorrect ? '✅ Correct' : '❌ Incorrect';
        let statusClass = isUnanswered ? 'unanswered' : isCorrect ? 'correct' : 'incorrect';
        
        reviewItem.innerHTML = `
            <div class="review-question">Question ${index + 1}: ${question.question}</div>
            <div class="review-status ${statusClass}">${statusText}</div>
            <div class="review-answer">
                <strong>Correct Answer:</strong> ${String.fromCharCode(65 + question.correct)}. ${question.options[question.correct]}<br>
                ${!isUnanswered ? `<strong>Your Answer:</strong> ${String.fromCharCode(65 + selectedAnswer)}. ${question.options[selectedAnswer]}` : ''}
            </div>
        `;
        
        reviewContainer.appendChild(reviewItem);
    });
    
    // Show results section
    quizSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
}

function retryQuiz() {
    appState.currentQuestion = 0;
    appState.selectedAnswers = {};
    quizSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    displayQuestion();
}

function goHome() {
    modeSelection.classList.remove('hidden');
    selectionPanel.classList.add('hidden');
    quizSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    appState.currentMode = null;
    appState.currentQuestion = 0;
    appState.selectedAnswers = {};
    appState.questions = [];
}

function downloadResults() {
    const { score, correct, incorrect, unanswered, total } = appState.results;
    const { year, subject, grade, chapter } = appState.filters;
    
    let content = `EUEE Practice Results\n`;
    content += `${'='.repeat(50)}\n\n`;
    content += `Subject: ${subject}\n`;
    content += `Year: ${year}\n`;
    if (grade) content += `Grade: ${grade}\n`;
    if (chapter) content += `Chapter: ${chapter}\n`;
    content += `\nResults:\n`;
    content += `Score: ${score}%\n`;
    content += `Correct: ${correct}/${total}\n`;
    content += `Incorrect: ${incorrect}/${total}\n`;
    content += `Unanswered: ${unanswered}/${total}\n`;
    content += `\nGenerated: ${new Date().toLocaleString()}\n`;
    
    // Create download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `EUEE-Results-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}