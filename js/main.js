// Знаходимо нові елементи на сторінці
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach((task) => renderTask(task))
}

checkEmptyList()

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)

function addTask(event) {
    //Відміняємо надсилання форим
    event.preventDefault();

    //Дістаємо текст завдання з поля input
    const taskText = taskInput.value

    //Виписуємо завдання у вигляді об'єкту
    const newTask = {
        id: Date.now(),
        text: taskInput.value,
        done: false,
    };

    //Додаємо завдання до массиву с завданнями
    tasks.push(newTask)

    renderTask(newTask)

    //Анулюємо поле вводу та повертаємо на нього фокус
    taskInput.value = ""
    taskInput.focus()

    // Викликаємо функцію перевірки чи пустий наш список справ
    checkEmptyList()

    //Зберігаємо поточні завдання до сховища
    saveToLocalStorage()
}

// Функція видалання завдання
function deleteTask(event) {

    //Перевіряємо чи користувач натиснув кнопку видалити
    if (event.target.dataset.action !== 'delete') return;

    const parenNode = event.target.closest('.list-group-item');

    //Визначаємо ID завдання
    const id = Number(parenNode.id);

    //Знаходимо індекс завдання в масиві
    const index = tasks.findIndex((task) => task.id === id)

    //Видаляємо завдання з масиву завдань
    tasks.splice(index, 1)

    //Удаляем задачу из разметки
    parenNode.remove()

    checkEmptyList()

    //Зберігаємо поточні завдання до сховища
    saveToLocalStorage()
}
// Функція виконання завдання
function doneTask(event) {
    //Перевіряємо чи користувач натиснув кнопку виконано
    if (event.target.dataset.action !== 'done') return;

    const parenNode = event.target.closest('.list-group-item');

    //Визначаємо ID завдання
    const id = Number(parenNode.id);
    const task = tasks.find((task) => task.id === id)
    task.done = !task.done

    const taskTitle = parenNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');

    //Зберігаємо поточні завдання до сховища
    saveToLocalStorage()
}
// Функція перевірки чи пустий наш список справ
function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
    <div class="empty-list__title">Список справ пуст</div>
  </li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    }
    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList')
        emptyListEl ? emptyListEl.remove() : null
    }
}
// Функція зберігання завдання до сховища
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    //Формуємо CSS клас
    const cssClass = task.done ? "task-title task-title--done" : "task-title"

    //Формуємо розмітку для нового завдання
    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
  <span class="${cssClass}">${task.text}</span>
  <div class="task-item__buttons">
    <button type="button" data-action="done" class="btn-action">
      <img src="./img/tick.svg" alt="Done" width="20" height="20">
    </button>
    <button type="button" data-action="delete" class="btn-action">
      <img src="./img/cross.svg" alt="Done" width="20" height="20">
    </button>
  </div>
</li>`

    //Додаємо завдання на сторінку
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}