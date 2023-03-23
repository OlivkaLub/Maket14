// Находим элементы на странице по id
const form = document.querySelector('#form');
// Находим инпут, с которого будем тянуть задачи
const taskInput = document.querySelector('#taskInput');
// Находим тег ul, чтобы обратиться к нему для добавления задачи на странице
const tasksList = document.querySelector('#tasksList');
// Находим emptyList для того, что с появлением задач менялся статус имеющихся задач
const emptyList = document.querySelector('#emptyList');
// Создадим массив, который будет содержать в себе все задачи
let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}


checkEmptyList();

// Добавление задачи
form.addEventListener('submit', addTask);

//  Удаление задачи
tasksList.addEventListener('click', deleteTask);

// Отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask);




// Рефакторинг. Упростим код. Поменяли коллбек функцию на function declaration
function addTask (event) {
    // event содержит всю инфу о событииеБ которое произошло
    // preventDefault - метод, который отменяет стандартное поведение. В данном случае используется для тогоБ чтобы страница не перезагружалась
    event.preventDefault();
    // Достаем текст задачи из поля ввода
    const taskText = taskInput.value

    // Сформируем объект, который будет формулировать эту задачу
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    // Добавляем задачу в массив с задачей
    tasks.push(newTask)

    // Добавляем задачу в хранилище браузера
    saveToLocalStorage();


    // Рендерим задачу на страницу
    renderTask(newTask);

    // Очищаем поле ввода и возвращаемна него фокус
    taskInput.value = "";
    taskInput.focus();

    checkEmptyList();
}

// Функция на удаление задачи
function deleteTask(event) {
    // Проверяем если клик был не по кнопке удалить задачу
    if(event.target.dataset.action !== 'delete') return;

    const parentNode = event.target.closest('.list-group-item');

    // Определяем ID задачи
    const id = Number(parentNode.id);

    // 2-й способ предыдущих двух действий
    tasks = tasks.filter((task) => task.id !== id)

    // Добавляем задачу в хранилище браузера
    saveToLocalStorage();

    // Удаляем задачу из разметки
    parentNode.remove();

    checkEmptyList();
}

// Функция для отметки задач как завершенные
function doneTask(event) {
    // Проверяем отсутствие клика по кнопке "задача выполнена"
    if (event.target.dataset.action !== "done") return;

    // Проверяем, что клик был по кнопке "задача выполнена"
    const parentNode =  event.target.closest('.list-group-item');

    // Сохранение в данных задачи, как завершенной
    // Определяем ID задачи
    const id = Number(parentNode.id)
    const task = tasks.find((task) => task.id === id)
    task.done = !task.done

    // Добавляем задачи в хранилище браузера
    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
}


function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}


function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}


function renderTask(task) {
    // Формируем класс
    const cssClass = task.done ? "task-title task-title--done" : "task-title"

    // Формируем разметку для новой задачи
    const taskHTML = `
                    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                        <span class="${cssClass}">${task.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                    </li>`;
    // Добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}