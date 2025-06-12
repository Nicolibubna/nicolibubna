document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const questionElement = document.querySelector('.question');
    const optionsContainer = document.querySelector('.options-container');
    const nextButton = document.querySelector('.next-btn');
    const questionCounter = document.querySelector('.question-counter');
    const scoreElement = document.querySelector('.score');
    const progressBar = document.querySelector('.progress');
    const resultContainer = document.querySelector('.result-container');
    const finalScoreElement = document.querySelector('.final-score');
    const finalMessageElement = document.querySelector('.final-message');
    const restartButton = document.querySelector('.restart-btn');
    
    // Variáveis do quiz
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOption = null;
    let quizCompleted = false;
    
    // Inicializar o quiz
    function initQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        quizCompleted = false;
        selectedOption = null;
        updateScore();
        showQuestion();
        resultContainer.classList.add('hidden');
    }
    
    // Mostrar a pergunta atual
    function showQuestion() {
        if (currentQuestionIndex >= questions.length) {
            endQuiz();
            return;
        }
        
        const question = questions[currentQuestionIndex];
        questionElement.textContent = question.question;
        
        // Limpar opções anteriores
        optionsContainer.innerHTML = '';
        
        // Adicionar novas opções
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            optionElement.addEventListener('click', selectOption);
            optionsContainer.appendChild(optionElement);
        });
        
        // Atualizar contador de perguntas
        questionCounter.textContent = `Pergunta ${currentQuestionIndex + 1}/${questions.length}`;
        
        // Atualizar barra de progresso
        const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        // Resetar botão próximo
        nextButton.textContent = currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Próxima';
        nextButton.disabled = true;
        selectedOption = null;
    }
    
    // Selecionar uma opção
    function selectOption(e) {
        if (quizCompleted) return;
        
        const selectedElement = e.target;
        const optionIndex = parseInt(selectedElement.dataset.index);
        
        // Remover seleção anterior
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.classList.remove('selected');
        });
        
        // Adicionar seleção atual
        selectedElement.classList.add('selected');
        selectedOption = optionIndex;
        nextButton.disabled = false;
    }
    
    // Verificar resposta e avançar
    function nextQuestion() {
        if (selectedOption === null && !quizCompleted) return;
        
        // Verificar resposta se não for o final do quiz
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            const options = document.querySelectorAll('.option');
            
            // Marcar resposta correta e incorreta
            options.forEach((option, index) => {
                option.classList.remove('selected');
                if (index === question.correctAnswer) {
                    option.classList.add('correct');
                } else if (index === selectedOption && index !== question.correctAnswer) {
                    option.classList.add('incorrect');
                }
                option.style.pointerEvents = 'none'; // Desativar cliques após seleção
            });
            
            // Atualizar pontuação
            if (selectedOption === question.correctAnswer) {
                score++;
                updateScore();
            }
            
            // Se for a última pergunta, mudar o texto do botão
            if (currentQuestionIndex === questions.length - 1) {
                nextButton.textContent = 'Ver Resultado';
            }
            
            currentQuestionIndex++;
        } else {
            endQuiz();
        }
        
        // Adicionar pequeno atraso antes de mostrar próxima pergunta
        setTimeout(() => {
            if (currentQuestionIndex < questions.length) {
                showQuestion();
            } else {
                endQuiz();
            }
        }, 1000);
    }
    
    // Atualizar pontuação
    function updateScore() {
        scoreElement.textContent = `Pontuação: ${score}`;
    }
    
    // Finalizar o quiz
    function endQuiz() {
        quizCompleted = true;
        questionElement.textContent = 'Quiz Concluído!';
        optionsContainer.innerHTML = '';
        nextButton.classList.add('hidden');
        
        // Mostrar resultado
        resultContainer.classList.remove('hidden');
        finalScoreElement.textContent = `Você acertou ${score} de ${questions.length} perguntas`;
        
        // Mensagem personalizada baseada no desempenho
        const percentage = (score / questions.length) * 100;
        let message = '';
        
        if (percentage >= 90) {
            message = 'Excelente! Você demonstrou um conhecimento excepcional em medicina.';
        } else if (percentage >= 70) {
            message = 'Muito bom! Você tem um bom conhecimento médico.';
        } else if (percentage >= 50) {
            message = 'Bom! Você tem uma base razoável, mas pode melhorar.';
        } else {
            message = 'Continue estudando! A medicina requer conhecimento contínuo.';
        }
        
        finalMessageElement.textContent = message;
    }
    
    // Event Listeners
    nextButton.addEventListener('click', nextQuestion);
    restartButton.addEventListener('click', initQuiz);
    
    // Iniciar o quiz
    initQuiz();
});