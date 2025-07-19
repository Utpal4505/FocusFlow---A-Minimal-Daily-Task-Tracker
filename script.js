// Setup Selections
const container = document.querySelector(".container");
const input = document.querySelector(".task-add");
const addBtn = document.querySelector(".add-btn");
const taskList = document.querySelector("#task-list");
const totalTaskEl = document.querySelector(".task-count");
const taskDoneEl = document.querySelector(".task-done");
const emptyState = document.querySelector(".empty-state");

let taskCount = 0;
let doneCount = 0;

// Set initial counts
updateTaskCount();
updateDoneCount();

// ========== LocalStorage Helpers ==========
function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasksToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ========== Functions ==========

//Task list empty msg
function checkEmptyState() {
  if (taskList.children.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }
}
checkEmptyState();

// Create a new task element
function createTaskElement(taskTextValue) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.className = "task-item";

  const taskText = document.createElement("span");
  taskText.className = "task-text";
  taskText.textContent = taskTextValue;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "completed";
  checkbox.setAttribute("aria-label", "Mark as done");

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "❌";
  deleteBtn.setAttribute("aria-label", "Delete task");

  // Append children
  actions.appendChild(checkbox);
  actions.appendChild(deleteBtn);
  span.appendChild(taskText);
  span.appendChild(actions);
  li.appendChild(span);

  // Attach functionality
  addCheckboxHandler(checkbox, taskText);
  addDeleteHandler(deleteBtn, li);

  return li;
}

// Handle checkbox (mark done)
function addCheckboxHandler(checkbox, taskText) {
  checkbox.addEventListener("click", () => {
    taskText.classList.toggle("mark-done");

    const text = taskText.textContent;
    let tasks = getTasksFromStorage();
    tasks = tasks.map((task) => {
      if (task.text === text) {
        return { ...task, done: checkbox.checked };
      }
      return task;
    });
    saveTasksToStorage(tasks);

    if (checkbox.checked) {
      doneCount++;
    } else {
      doneCount--;
    }
    updateDoneCount();
  });
}

// Handle delete
function addDeleteHandler(deleteBtn, taskElement) {
  deleteBtn.addEventListener("click", () => {
    const checkbox = taskElement.querySelector(".completed");
    const taskText = taskElement.querySelector(".task-text").textContent;

    if (checkbox.checked) {
      doneCount--;
      updateDoneCount();
    }

     // Remove from localStorage
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => task.text !== taskText);
    saveTasksToStorage(tasks);

    taskElement.remove();
    taskCount--;
    updateTaskCount();
    checkEmptyState();
  });
}

// Update UI count
function updateTaskCount() {
  totalTaskEl.textContent = `Total Task: ${taskCount}`;
}

function updateDoneCount() {
  taskDoneEl.textContent = `Task Done: ${doneCount}`;
}

// Add new task
function addTask() {
  const val = input.value.trim();
  if (val === "") {
    alert("Please add valid Task.");
    return;
  }

  const existingTasks = getTasksFromStorage();
  for (let task of existingTasks) {
    if (task.text.toLowerCase() === val.toLowerCase()) {
      alert("Task already exists!");
      input.value = "";
      return;
    }
  }

  const newTask = createTaskElement(val);
  taskList.appendChild(newTask);

  // Update UI & localStorage
  taskCount++;
  updateTaskCount();
  checkEmptyState();
  doneCount += 0;
  updateDoneCount();

  existingTasks.push({ text: val, done: false });
  saveTasksToStorage(existingTasks);

  input.value = "";
}
// ========== Event Listeners ==========

addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// ========== Load Tasks from Storage on Page Load ==========
window.addEventListener("DOMContentLoaded", () => {
  const tasks = getTasksFromStorage();
  tasks.forEach(task => {
    const li = createTaskElement(task.text, task.done);
    taskList.appendChild(li);
    taskCount++;
    if (task.done) doneCount++;
  });

  updateTaskCount();
  updateDoneCount();
  checkEmptyState();
});