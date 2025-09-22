// Aguarda o DOM estar completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os elementos do DOM com os quais vamos interagir
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Carrega as tarefas salvas no localStorage quando a página é carregada
    loadTasks();

    // Adiciona um "ouvinte" para o evento de envio do formulário
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        const taskText = taskInput.value.trim(); // Pega o texto da tarefa e remove espaços extras

        if (taskText !== '') {
            addTask(taskText); // Adiciona a nova tarefa
            saveTasks(); // Salva a lista de tarefas atualizada
            taskInput.value = ''; // Limpa o campo de input
            taskInput.focus(); // Coloca o foco de volta no input
        }
    });
    
    // Adiciona um "ouvinte" para cliques na lista de tarefas (<ul>)
    // Isso é mais eficiente do que adicionar um ouvinte para cada item da lista
    taskList.addEventListener('click', (event) => {
        // Verifica se o clique foi no botão de deletar
        if (event.target.classList.contains('delete-btn')) {
            const li = event.target.parentElement; // Pega o item da lista (<li>)
            taskList.removeChild(li); // Remove o item da lista
            saveTasks(); // Salva a lista de tarefas atualizada
        } 
        // Verifica se o clique foi no texto da tarefa para marcá-la como concluída
        else if (event.target.tagName === 'LI' || event.target.tagName === 'SPAN') {
            const li = event.target.closest('li'); // Encontra o <li> mais próximo
            li.classList.toggle('completed'); // Adiciona ou remove a classe 'completed'
            saveTasks(); // Salva a lista de tarefas atualizada
        }
    });

    /**
     * Cria e adiciona um novo item de tarefa (<li>) à lista (<ul>).
     * @param {string} text - O texto da tarefa.
     * @param {boolean} isCompleted - Se a tarefa já está concluída.
     */
    function addTask(text, isCompleted = false) {
        const li = document.createElement('li'); // Cria um elemento <li>
        if (isCompleted) {
            li.classList.add('completed'); // Adiciona a classe se a tarefa estiver concluída
        }
        
        // Estrutura interna do <li>
        li.innerHTML = `
            <span>${text}</span>
            <button class="delete-btn">X</button>
        `;
        
        taskList.appendChild(li); // Adiciona o <li> à lista <ul>
    }

    /**
     * Salva todas as tarefas da lista no localStorage do navegador.
     */
    function saveTasks() {
        const tasks = [];
        // Itera sobre todos os <li> dentro da lista
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent, // Pega o texto da tarefa
                completed: li.classList.contains('completed') // Verifica se está concluída
            });
        });
        // Converte o array de tarefas para uma string JSON e salva no localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    /**
     * Carrega as tarefas do localStorage e as exibe na tela.
     */
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')); // Pega as tarefas salvas
        
        if (tasks) {
            tasks.forEach(task => {
                addTask(task.text, task.completed); // Adiciona cada tarefa à lista
            });
        }
    }
});