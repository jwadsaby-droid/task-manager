const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const emptyState = document.getElementById('emptyState');
const clearCompleted = document.getElementById('clearCompleted');
const filterButtons = document.querySelectorAll('.filter');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getVisibleTasks() {
  if (currentFilter === 'completed') {
    return tasks.filter(task => task.completed);
  }

  if (currentFilter === 'pending') {
    return tasks.filter(task => !task.completed);
  }

  return tasks;
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  taskList.innerHTML = '';

  visibleTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <input class="checkbox" type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task as completed">
      <span class="task-text"></span>
      <div class="actions">
        <button class="action-btn edit" type="button">Edit</button>
        <button class="action-btn delete" type="button">Delete</button>
      </div>
    `;

    li.querySelector('.task-text').textContent = task.text;
    taskList.appendChild(li);
  });

  const pendingCount = tasks.filter(task => !task.completed).length;
  taskCount.textContent = pendingCount;
  emptyState.hidden = visibleTasks.length !== 0;
}

taskForm.addEventListener('submit', event => {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (!text) {
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: Date.now(),
    text,
    completed: false
  });

  taskInput.value = '';
  saveTasks();
  renderTasks();
  taskInput.focus();
});

taskList.addEventListener('click', event => {
  const taskElement = event.target.closest('.task');
  if (!taskElement) return;

  const id = Number(taskElement.dataset.id);
  const task = tasks.find(item => item.id === id);

  if (!task) return;

  if (event.target.classList.contains('delete')) {
    tasks = tasks.filter(item => item.id !== id);
  }

  if (event.target.classList.contains('edit')) {
    const newText = prompt('Edit your task:', task.text);

    if (newText !== null && newText.trim()) {
      task.text = newText.trim();
    }
  }

  saveTasks();
  renderTasks();
});

taskList.addEventListener('change', event => {
  if (!event.target.classList.contains('checkbox')) return;

  const taskElement = event.target.closest('.task');
  const id = Number(taskElement.dataset.id);
  const task = tasks.find(item => item.id === id);

  if (!task) return;

  task.completed = event.target.checked;
  saveTasks();
  renderTasks();
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');

    renderTasks();
  });
});

clearCompleted.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
