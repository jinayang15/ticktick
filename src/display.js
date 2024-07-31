import { add } from "date-fns";
import { Task, List } from "./class";
import * as App from "./app";

const images = importAllAssets(
  require.context("./assets", false, /\.(png|jpe?g|svg)$/)
);

function importAllAssets(r) {
  const paths = r.keys();
  const images = {};
  paths.forEach((path) => {
    const key = path.replace("./", "").replace(/\.(png|jpe?g|svg)$/, "");
    images[key] = r(path);
  });
  return images;
}

export function clearSection(id) {
  const section = document.getElementById(id);
  section.textContent = "";
}

export function initCategoriesSection() {
  const categoriesSectionContainer =
    document.getElementById("categories-section");
  const hrSeparator = document.createElement("hr");

  categoriesSectionContainer.classList.remove("hidden");

  hrSeparator.classList.add("horizontal", "categories", "separator");
  categoriesSectionContainer.classList.add(
    "categories",
    "section",
    "container"
  );

  categoriesSectionContainer.append(
    createGroupByPeriod(),
    hrSeparator,
    createGroupByList(),
    hrSeparator.cloneNode(true),
    createGroupByOther()
  );
}

function createGroupByPeriod() {
  const groupByPeriodContainer = document.createElement("div");
  groupByPeriodContainer.classList.add("group-by", "period", "container");
  groupByPeriodContainer.append(
    createGroupByItem("Today", "calendar_view_day", "period"),
    createGroupByItem("Next 7 Days", "calendar_view_week", "period"),
    createGroupByItem("All Tasks", "all_task_list", "period")
  );
  return groupByPeriodContainer;
}

function createGroupByList() {
  const groupByListContainer = document.createElement("div");
  const groupByListHeading = document.createElement("h4");
  const addListIcon = document.createElement("img");
  const addListModal = createAddListModal();

  groupByListContainer.classList.add("group-by", "list", "container");

  groupByListHeading.textContent = "Lists";
  groupByListHeading.classList.add("group-by", "list", "heading");

  addListIcon.classList.add("add-list", "add-icon");
  addListIcon.src = images["add_list"];
  addListIcon.addEventListener("click", () => {
    addListModal.showModal();
  });

  groupByListHeading.appendChild(addListIcon);
  groupByListHeading.appendChild(addListModal);
  groupByListContainer.appendChild(groupByListHeading);
  const lists = App.getLists();
  for (let i = 0; i < lists.length; i++) {
    lists[i].idx = i;
    groupByListContainer.appendChild(createListClickable(lists[i]));
  }
  return groupByListContainer;
}

function createGroupByOther() {
  const groupByOtherContainer = document.createElement("div");
  groupByOtherContainer.classList.add("group-by", "other", "container");
  groupByOtherContainer.append(
    createGroupByItem("Completed", "checkbox_checked", "other"),
    createGroupByItem("Trash", "delete", "other")
  );

  return groupByOtherContainer;
}

function createGroupByItem(label, imgName, type, idx = -1) {
  const item = document.createElement("div");
  item.classList.add("group-by", "item", type);
  item.dataset.list = idx;

  const img = document.createElement("img");
  img.classList.add("group-by", "svg", type);
  img.src = images[imgName];

  const span = document.createElement("span");
  span.classList.add("group-by", "text", type);
  span.textContent = label;

  item.appendChild(img);
  item.appendChild(span);
  return item;
}

function createListClickable(list) {
  const listContainer = createGroupByItem(
    list.name,
    "list_icon",
    "list",
    list.idx
  );
  listContainer.addEventListener("click", () => {
    clearSection("tasks-section");
    clearSection("view-task-section");
    initTasksSection(list);
  });
  return listContainer;
}

function displayNewListInCategories() {
  const groupByListContainer = document
    .getElementById("categories-section")
    .querySelector(".group-by.list.container");
  const lists = App.getLists();
  const newList = lists[lists.length - 1];
  groupByListContainer.appendChild(createListClickable(newList));
}

export function initTasksSection(list) {
  const tasksSectionContainer = document.getElementById("tasks-section");
  tasksSectionContainer.dataset.list = list.idx;

  const taskSeparator = document.createElement("hr");
  taskSeparator.classList.add("horizontal", "task", "separator");

  tasksSectionContainer.append(
    createTaskSectionHeading(list.name),
    createAddTaskBar()
  );
  for (let i = 0; i < list.tasks.length; i++) {
    list.tasks[i].idx = i;
    tasksSectionContainer.appendChild(createTaskClickable(list.tasks[i]));
    taskSeparator.dataset.task = i;
    tasksSectionContainer.appendChild(taskSeparator.cloneNode(true));
  }

  addMenuToggle();
}

export function addMenuToggle() {
  const menuToggle = document.getElementById("menu-toggle");
  const categoriesSection = document.getElementById("categories-section");
  menuToggle.addEventListener("click", () => {
    if (menuToggle.src == images["menu_collapse"]) {
      menuToggle.src = images["menu_expand"];
      clearSection("categories-section");
      categoriesSection.classList.add("hidden");
    } else {
      menuToggle.src = images["menu_collapse"];
      initCategoriesSection();
    }
  });
}

function createTaskSectionHeading(listName = "Default") {
  const tasksHeadingContainer = document.createElement("div");
  tasksHeadingContainer.classList.add("tasks", "heading", "container");

  const menuToggle = document.createElement("img");
  menuToggle.classList.add("tasks", "heading", "svg");
  menuToggle.src = images["menu_collapse"];
  menuToggle.alt = "Menu Collapse";
  menuToggle.id = "menu-toggle";

  const tasksListName = document.createElement("span");
  tasksListName.classList.add("tasks", "heading", "text");
  tasksListName.textContent = listName;

  const sortButton = document.createElement("img");
  sortButton.classList.add("tasks", "heading", "svg");
  sortButton.src = images["sort"];
  sortButton.alt = "Sort Tasks";

  const moreButton = document.createElement("img");
  moreButton.classList.add("tasks", "heading", "svg");
  moreButton.src = images["more_hori"];
  moreButton.alt = "More";

  tasksHeadingContainer.append(
    menuToggle,
    tasksListName,
    sortButton,
    moreButton
  );

  return tasksHeadingContainer;
}

function createAddTaskBar() {
  const addTaskBarContainer = document.createElement("div");
  addTaskBarContainer.classList.add("add-task", "input", "container");

  const addTaskBar = document.createElement("input");
  addTaskBar.id = "add-task";
  addTaskBar.name = "add-task";
  addTaskBar.type = "text";
  addTaskBar.placeholder = "+ Add Task";

  const addTaskOptionsContainer = document.createElement("div");
  addTaskOptionsContainer.classList.add("add-task", "svgs", "container");

  const addTaskDate = document.createElement("img");
  addTaskDate.classList.add("add-task", "svg", "hidden");
  addTaskDate.src = images["calendar_options"];
  addTaskDate.alt = "Calendar Options";

  const addTaskProperties = document.createElement("img");
  addTaskProperties.classList.add("add-task", "svg", "hidden");
  addTaskProperties.src = images["arrow_down"];
  addTaskProperties.alt = "Other Options";

  addTaskOptionsContainer.append(addTaskDate, addTaskProperties);

  addTaskBarContainer.append(addTaskBar, addTaskOptionsContainer);

  addTaskBar.addEventListener("focus", () => {
    addTaskDate.classList.toggle("hidden");
    addTaskProperties.classList.toggle("hidden");
  });

  addTaskBar.addEventListener("focusout", () => {
    addTaskDate.classList.toggle("hidden");
    addTaskProperties.classList.toggle("hidden");
  });

  return addTaskBarContainer;
}

function createTask(task) {
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task", "container");
  taskContainer.dataset.task = task.idx;

  const taskCheckboxLabel = document.createElement("label");
  const taskCheckbox = document.createElement("input");
  const taskCheckmark = document.createElement("span");

  taskCheckbox.classList.add("task", "checkbox");
  taskCheckbox.type = "checkbox";
  taskCheckbox.checked = task.complete;
  taskCheckmark.classList.add("checkmark");
  taskCheckboxLabel.append(taskCheckbox, taskCheckmark);

  const taskDetailsContainer = document.createElement("div");
  taskDetailsContainer.classList.add("task-details", "container");

  const taskName = document.createElement("span");
  const taskDueDate = document.createElement("span");
  taskName.classList.add("task", "name");
  taskName.dataset.ph = "No Title";
  taskDueDate.classList.add("task", "due-date");
  taskName.textContent = task.name;
  taskDueDate.textContent = task.dueDate.toDateString();

  taskDetailsContainer.append(taskName, taskDueDate);
  taskContainer.append(taskCheckboxLabel, taskDetailsContainer);

  return taskContainer;
}

function createTaskClickable(task) {
  const taskContainer = createTask(task);
  taskContainer.addEventListener("click", () => {
    clearSection("view-task-section");
    initViewTaskSection(task);
    disableActiveTask();
    taskContainer.classList.add("active");
    hideTaskSeparator(taskContainer.dataset.task);
  });
  taskContainer.addEventListener("mouseover", () => {
    if (!taskContainer.classList.contains("active")) {
      hideTaskSeparator(taskContainer.dataset.task);
    }
  });
  taskContainer.addEventListener("mouseout", () => {
    if (!taskContainer.classList.contains("active")) {
      showTaskSeparator(taskContainer.dataset.task);
    }
  });
  return taskContainer;
}

function showTaskSeparator(taskIdx) {
  const taskSeparator = document.querySelector(
    `.task.separator[data-task='${taskIdx}']`
  );
  taskSeparator.classList.remove("hidden");
}

function hideTaskSeparator(taskIdx) {
  const taskSeparator = document.querySelector(
    `.task.separator[data-task='${taskIdx}']`
  );
  taskSeparator.classList.add("hidden");
}

function disableActiveTask() {
  const currentTasks = document.querySelectorAll(".task.container.active");
  currentTasks.forEach((element) => {
    element.classList.remove("active");
    showTaskSeparator(element.dataset.task);
  });
}

export function initViewTaskSection(task) {
  const viewTaskSection = document.getElementById("view-task-section");
  viewTaskSection.dataset.task = task.idx;
  const horizontalSeparator = document.createElement("hr");
  horizontalSeparator.classList.add("horizontal", "view-task", "separator");
  viewTaskSection.append(
    createViewTaskHeader(task.dueDate),
    horizontalSeparator,
    createViewTaskBody(task.name, task.desc)
  );
  saveTaskOnEdit(viewTaskSection);
}

function createViewTaskHeader(dueDate) {
  const viewTaskHeaderContainer = document.createElement("div");
  viewTaskHeaderContainer.classList.add("view-task", "header", "container");

  const checkboxLabel = document.createElement("label");
  const checkbox = document.createElement("input");
  const checkmark = document.createElement("span");
  checkbox.classList.add("view-task", "checkbox");
  checkbox.type = "checkbox";
  checkmark.classList.add("checkmark");
  checkboxLabel.append(checkbox, checkmark);

  const verticalSeparator = document.createElement("hr");
  verticalSeparator.classList.add("vertical", "view-task", "separator");

  const viewTaskDateContainer = document.createElement("span");
  viewTaskDateContainer.classList.add("view-task", "date", "container");

  const viewTaskDueDateIcon = document.createElement("img");
  viewTaskDueDateIcon.classList.add("view-task", "header", "svg");
  viewTaskDueDateIcon.src = images["calendar_icon"];

  const viewTaskDueDate = document.createElement("span");
  viewTaskDueDate.classList.add("view-task", "due-date");
  try {
    viewTaskDueDate.textContent = dueDate.toDateString();
  } catch (error) {
    viewTaskDueDate.textContent = "Due Date";
  }

  viewTaskDateContainer.append(viewTaskDueDateIcon, viewTaskDueDate);

  const viewTaskPriority = document.createElement("img");
  viewTaskPriority.classList.add("view-task", "header", "svg");
  viewTaskPriority.src = images["priority_flag"];
  viewTaskPriority.alt = "Priority";

  viewTaskHeaderContainer.append(
    checkboxLabel,
    verticalSeparator,
    viewTaskDateContainer,
    viewTaskPriority
  );

  return viewTaskHeaderContainer;
}

function createViewTaskBody(name = "Task Name", desc = "") {
  const viewTaskBodyContainer = document.createElement("div");
  viewTaskBodyContainer.classList.add("view-task", "body", "container");

  const viewTaskName = document.createElement("h3");
  viewTaskName.classList.add("view-task", "name");
  viewTaskName.contentEditable = true;
  viewTaskName.dataset.ph = "Task Name";
  viewTaskName.textContent = name;

  const viewTaskDescription = document.createElement("div");
  viewTaskDescription.classList.add("view-task", "description");
  viewTaskDescription.contentEditable = true;
  viewTaskDescription.dataset.ph = "Description";
  viewTaskDescription.textContent = desc;

  viewTaskBodyContainer.append(viewTaskName, viewTaskDescription);

  return viewTaskBodyContainer;
}

function saveTaskOnEdit(viewTaskSection) {
  const taskName = viewTaskSection.querySelector(".name");
  const taskDesc = viewTaskSection.querySelector(".description");

  taskName.addEventListener("input", () => {
    const tasksSection = document.getElementById("tasks-section");
    const listIdx = Number(tasksSection.dataset.list);
    const taskIdx = Number(viewTaskSection.dataset.task);
    const clickableTaskName = tasksSection.querySelector(
      `.task.container[data-task='${taskIdx}'] .name`
    );

    const lists = App.getLists();
    lists[listIdx].tasks[taskIdx].name = taskName.textContent;
    clickableTaskName.textContent = taskName.textContent;
  });

  taskDesc.addEventListener("input", () => {
    const tasksSection = document.getElementById("tasks-section");
    const listIdx = Number(tasksSection.dataset.list);
    const taskIdx = Number(viewTaskSection.dataset.task);
    const lists = App.getLists();

    lists[listIdx].tasks[taskIdx].desc = taskDesc.textContent;
  });
}

function createAddListModal() {
  const addListModal = document.createElement("dialog");
  const addListForm = document.createElement("form");
  const formHeading = document.createElement("h4");
  const listNameInput = document.createElement("input");
  const buttonsContainer = document.createElement("div");
  const cancelButton = document.createElement("button");
  const saveButton = document.createElement("button");

  addListModal.classList.add("add-list", "modal");

  addListForm.classList.add("add-list", "form");

  formHeading.classList.add("add-list", "form", "heading");
  formHeading.textContent = "Add List";

  listNameInput.classList.add("add-list", "add-name");
  listNameInput.type = "text";
  listNameInput.placeholder = "List Name";

  buttonsContainer.classList.add("add-list", "buttons-container");

  cancelButton.classList.add("add-list", "button", "cancel");
  cancelButton.textContent = "Cancel";
  saveButton.classList.add("add-list", "button", "save");
  saveButton.textContent = "Save";
  saveButton.type = "submit";
  saveButton.setAttribute("form", "add-list-form");
  saveButton.disabled = true;

  cancelButton.addEventListener("click", () => {
    listNameInput.value = "";
    saveButton.disabled = true;
    addListModal.close();
  });

  listNameInput.addEventListener("input", () => {
    if (listNameInput.value.trim() != "") {
      saveButton.disabled = false;
    } else {
      saveButton.disabled = true;
    }
  });

  saveButton.addEventListener("click", (event) => {
    event.preventDefault();
    const listName = listNameInput.value;
    App.addList(new List(App.getLists().length, listName));
    displayNewListInCategories();

    listNameInput.value = "";
    saveButton.disabled = true;
    addListModal.close();
  });

  buttonsContainer.append(cancelButton, saveButton);

  addListForm.appendChild(formHeading);
  addListForm.appendChild(listNameInput);
  addListModal.appendChild(addListForm);
  addListModal.appendChild(buttonsContainer);

  return addListModal;
}
