const addBtn = document.querySelector("#add-btn");
const clearBtn = document.querySelector("#clear-btn");
const taskInput = document.querySelector("#task-input");
const pendingList = document.querySelector("#pending-list");
const completedList = document.querySelector("#completed-list");
const labelContainer = document.querySelector(".label-container");

let pendingListItems = [];
let completedListItems = [];

function addPendingTask(text) {
  const pendingTask = {
    id: Date.now(),
    text: taskInput.value.trim(),
    completed: false,
  };

  pendingListItems.push(pendingTask);
  addTask(pendingTask);
}

// Add task to list when clicked
addBtn.addEventListener("click", (event) => {
  event.preventDefault();
  validateTask();
});

// Add task to list when enter key is pressed
taskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    validateTask();
  }
});

// Clear completed tasks
clearBtn.addEventListener("click", () => {
  const clearError = document.querySelector("#clear-error");
  if (completedList.innerHTML === "") {
    clearError.innerHTML = "No completed tasks to clear.";
    if (clearError.innerHTML === "No completed tasks to clear.") {
      setTimeout(() => {
        clearError.innerHTML = "";
      }, 3000);
    }
  } else {
    completedList.textContent = "";
    clearError.innerHTML = "";
  }
});

// Delete task
pendingList.addEventListener("click", deleteTask);
completedList.addEventListener("click", deleteTask);

// Edit task
pendingList.addEventListener("click", editTask);
completedList.addEventListener("click", editTask);

// Copy/duplicate task
pendingList.addEventListener("click", duplicateTask);
completedList.addEventListener("click", duplicateTask);

// Functions
/**
 * @function validateTask - checks if the input is empty or not before calling the addTask function
 *
 */
function validateTask() {
  const errorMessage = document.querySelector("#form-error");
  if (taskInput.value.trim() === "") {
    errorMessage.innerHTML = "Invalid input. Please enter a task.";
  } else {
    errorMessage.innerHTML = "";
    addPendingTask();
  }
}

function addTask() {
  const text = taskInput.value.trim();

  // Creat new task list item
  const newTask = document.createElement("li");

  // Div for checkbox and label
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("label-container");

  // Create checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = Date.now();

  // custom checkbox
  const customCheckbox = document.createElement("span");
  customCheckbox.classList.add("custom-checkbox");

  // Label for checkbox
  const label = document.createElement("label");
  label.htmlFor = checkbox.id;
  label.innerHTML = text;

  // Append elements to new task
  taskDiv.appendChild(label);
  taskDiv.appendChild(checkbox);
  taskDiv.appendChild(customCheckbox);
  newTask.appendChild(taskDiv);
  pendingList.appendChild(newTask);

  // Add edit, delete and duplicate buttons
  const iconBtns = document.createElement("div");
  iconBtns.classList.add("icon-btns");

  const editBtn = document.createElement("i");
  editBtn.classList.add("fa-regular", "fa-pen-to-square");

  const duplicateBtn = document.createElement("i");
  duplicateBtn.classList.add("fa-regular", "fa-copy");

  const deleteBtn = document.createElement("i");
  deleteBtn.classList.add("fa-regular", "fa-trash-can");

  iconBtns.appendChild(editBtn);
  iconBtns.appendChild(duplicateBtn);
  iconBtns.appendChild(deleteBtn);
  newTask.appendChild(iconBtns);

  // Move task to completed list when checked and vice versa
  newTask.addEventListener("change", (event) => {
    if (event.target.type === "checkbox") {
      if (event.target.checked) {
        completedList.appendChild(newTask);
        label.classList.add("checked");
        const completedTask = {
          id: checkbox.id,
          date: Date.now(),
          text: label.innerHTML,
          completed: true,
        };
        const pendingIndexOf = pendingListItems.indexOf();
        completedListItems.push(completedTask);
        pendingListItems.indexOf(checkbox.id);
        pendingListItems.splice(pendingIndexOf, 1);
      } else {
        pendingList.appendChild(newTask);
        label.classList.remove("checked");
        completedListItems = completedListItems.filter((task) => task.id !== newTask.id);
        const pendingTask = {
          id: checkbox.id,
          text: label.innerHTML,
          completed: false,
        };
        const completedIndexOf = completedListItems.indexOf();
        pendingListItems.push(pendingTask);
        completedListItems.indexOf(checkbox.id);
        completedListItems.splice(completedIndexOf, 1);
      }
    }
  });

  // Clear input field
  taskInput.value = "";
}

/**
 * @function deleteTask - deletes a task from the list
 *  */
function deleteTask(event) {
  const target = event.target;
  if (target.classList.contains("fa-trash-can")) {
    target.parentNode.parentNode.remove();
  }
}

/**
 * @function editTask - edits a task from the list
 *  */
function editTask(event) {
  const target = event.target;
  if (target.classList.contains("fa-pen-to-square")) {
    const currentTask = target.parentNode.previousElementSibling;
    const label = currentTask.querySelector("label");
    const newTask = document.createElement("input");
    newTask.type = "text";
    newTask.value = label.innerHTML;
    newTask.placeholder = label.innerHTML;
    newTask.classList.add("edit-input");
    currentTask.appendChild(newTask);
    label.style.display = "none";
    newTask.focus();

    // Replace edit button with save button
    const iconBtns = target.parentNode;
    const saveBtn = document.createElement("i");
    saveBtn.classList.add("fa-regular", "fa-save");

    iconBtns.appendChild(saveBtn);

    const editBtn = target;
    editBtn.replaceWith(saveBtn);

    // Saved edited task with enter key
    newTask.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        if (newTask.value.trim() === "") {
          alert("Invalid input. Please enter a task.");
        } else {
          label.innerHTML = newTask.value.trim();
          label.style.display = "block";
          newTask.remove();
        }
      }
    });

    // Save edited task with save button
    saveBtn.addEventListener("click", () => {
      if (newTask.value.trim() === "") {
        alert("Invalid input. Please enter a task.");
      } else {
        label.innerHTML = newTask.value.trim();
        label.style.display = "block";
        newTask.remove();
        saveBtn.replaceWith(editBtn);
      }
    });
  }
}

/**
 * @function duplicateTask - duplicates a task from the list
 *  */

function duplicateTask(event) {
  const target = event.target;
  if (target.classList.contains("fa-copy")) {
    const currentTask = target.parentNode.previousElementSibling;
    const duplicate = currentTask.cloneNode(true);
    const newTask = document.createElement("li");

    // Add edit, delete and duplicate buttons
    const iconBtns = document.createElement("div");
    iconBtns.classList.add("icon-btns");

    const editBtn = document.createElement("i");
    editBtn.classList.add("fa-regular", "fa-pen-to-square");

    const duplicateBtn = document.createElement("i");
    duplicateBtn.classList.add("fa-regular", "fa-copy");

    const deleteBtn = document.createElement("i");
    deleteBtn.classList.add("fa-regular", "fa-trash-can");

    iconBtns.appendChild(editBtn);
    iconBtns.appendChild(duplicateBtn);
    iconBtns.appendChild(deleteBtn);

    newTask.appendChild(duplicate);
    newTask.appendChild(iconBtns);
    pendingList.appendChild(newTask);

    // Changes the id of the duplicated task to avoid duplicate ids
    const duplicateId = duplicate.querySelector("input").id;
    const copyTaskId = currentTask.querySelector("input").id;
    if (duplicateId === copyTaskId) {
      duplicate.querySelector("input").id = Date.now() + "copy";
      duplicate.querySelector("label").htmlFor = duplicate.querySelector("input").id;
    }

    // Move task to completed list when checked and vice versa
    newTask.addEventListener("change", (event) => {
      if (event.target.type === "checkbox") {
        if (event.target.checked) {
          completedList.appendChild(newTask);
          duplicate.querySelector("label").classList.add("checked");
        } else {
          pendingList.appendChild(newTask);
          duplicate.querySelector("label").classList.remove("checked");
        }
      }
    });
  }
}