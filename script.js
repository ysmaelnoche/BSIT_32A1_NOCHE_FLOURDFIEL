document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const task = taskInput.value.trim();
        if (task) {
            const taskItem = {
                id: Date.now(),
                text: task,
                completed: false,
                priority: 'medium',
                dueDate: null
            };
            saveTask(taskItem);
            renderTask(taskItem);
            taskInput.value = '';
        } else {
            alert('Task cannot be empty!');
        }
    }

    function renderTask(taskItem) {
        const listItem = document.createElement('li');
        listItem.className = `list-group-item d-flex justify-content-between align-items-center ${taskItem.completed ? 'list-group-item-success' : ''}`;
        listItem.dataset.id = taskItem.id;

        listItem.innerHTML = `
            <span>${taskItem.text}</span>
            <div>
                <button class="btn btn-sm btn-success done-button">${taskItem.completed ? 'Undo' : 'Done'}</button>
                <button class="btn btn-sm btn-warning edit-button">Edit</button>
                <button class="btn btn-sm btn-danger delete-button">Delete</button>
            </div>
        `;
        taskList.appendChild(listItem);
    }

    function saveTask(taskItem) {
        const tasks = getTasks();
        tasks.push(taskItem);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(task => renderTask(task));
    }

    function updateTask(taskId, updatedTask) {
        const tasks = getTasks();
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = updatedTask;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function deleteTask(taskId) {
        const tasks = getTasks().filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    taskList.addEventListener('click', (e) => {
        const listItem = e.target.closest('li');
        const taskId = parseInt(listItem.dataset.id);

        if (e.target.classList.contains('delete-button')) {
            listItem.remove();
            deleteTask(taskId);
        }

        if (e.target.classList.contains('done-button')) {
            const tasks = getTasks();
            const task = tasks.find(task => task.id === taskId);
            task.completed = !task.completed;
            updateTask(taskId, task);
            listItem.classList.toggle('list-group-item-success');
            e.target.textContent = task.completed ? 'Undo' : 'Done';
        }

        if (e.target.classList.contains('edit-button')) {
            const tasks = getTasks();
            const task = tasks.find(task => task.id === taskId);
            const newText = prompt('Edit your task:', task.text);
            if (newText && newText.trim()) {
                task.text = newText.trim();
                updateTask(taskId, task);
                listItem.querySelector('span').textContent = newText.trim();
            }
        }
    });
});