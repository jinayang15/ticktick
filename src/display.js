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

  const groupByListContainer = document.createElement("div");
  groupByListContainer.classList.add("group-by", "list", "container");
  groupByListContainer.id = "group-by-list";

  categoriesSectionContainer.append(
    createGroupByPeriod(),
    hrSeparator,
    groupByListContainer,
    hrSeparator.cloneNode(true),
    createGroupByOther()
  );

  addToGroupByList();
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

function addToGroupByList() {
  const groupByListContainer = document.getElementById("group-by-list");
  const groupByListHeading = document.createElement("h4");
  const addListIcon = document.createElement("img");
  const addListModal = createAddListModal();

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
}

function createGroupByOther() {
  const groupByOtherContainer = document.createElement("div");
  groupByOtherContainer.classList.add("group-by", "other", "container");
  groupByOtherContainer.append(
    createGroupByItem("Completed", "checkbox_checked", "other")
    // createGroupByItem("Trash", "delete", "other")
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
    disableActiveList();
    listContainer.classList.add("active");
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

function disableActiveList() {
  const currentList = document.querySelectorAll(".group-by.active");
  currentList.forEach((element) => {
    element.classList.remove("active");
  });
}

function deleteList() {
  const listIdx = Number(document.getElementById("tasks-section").dataset.list);
  App.deleteList(listIdx);
  clearSection("tasks-section");
  clearSection("group-by-list");
  addToGroupByList();
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

  const moreDropdown = document.createElement("dialog");
  moreDropdown.classList.add("tasks", "more-dropdown");

  const moreDropdownDelete = document.createElement("div");
  moreDropdownDelete.classList.add(
    "more-dropdown",
    "item",
    "container",
    "delete"
  );

  const deleteSvg = document.createElement("img");
  deleteSvg.classList.add("more-dropdown", "item", "svg", "delete");
  deleteSvg.src = images["delete"];
  deleteSvg.alt = "Delete List";

  const deleteText = document.createElement("span");
  deleteText.classList.add("more-dropdown", "item", "text", "delete");
  deleteText.textContent = "Delete";

  moreDropdownDelete.append(deleteSvg, deleteText);

  moreDropdown.appendChild(moreDropdownDelete);

  document.addEventListener("click", (e) => {
    const clickMore = moreButton.contains(e.target);
    const clickDropdown = moreDropdown.contains(e.target);

    if (!clickMore && !clickDropdown) {
      moreDropdown.open = false;
    }
  });

  moreButton.addEventListener("click", () => {
    moreDropdown.open = !moreDropdown.open;
  });

  moreDropdownDelete.addEventListener("click", () => {
    deleteList();
    moreDropdown.open = false;
  });

  tasksHeadingContainer.append(
    menuToggle,
    tasksListName,
    sortButton,
    moreButton,
    moreDropdown
  );

  return tasksHeadingContainer;
}

function createAddTaskBar() {
  const addTaskBarContainer = document.createElement("form");
  addTaskBarContainer.classList.add("add-task", "input", "container");

  const addTaskBar = document.createElement("input");
  addTaskBar.id = "add-task";
  addTaskBar.name = "add-task";
  addTaskBar.type = "text";
  addTaskBar.placeholder = "+ Add Task";

  const addTaskOptionsContainer = document.createElement("div");
  addTaskOptionsContainer.classList.add(
    "add-task",
    "svgs",
    "container",
    "hidden"
  );

  const addTaskDateLabel = document.createElement("label");
  addTaskDateLabel.classList.add("add-task", "date", "label", "hidden");

  const addTaskDateInput = document.createElement("input");
  addTaskDateInput.setAttribute("type", "datetime-local");
  addTaskDateInput.classList.add("add-task", "date-picker");

  let now = new Date();
  now.setUTCHours(0, 0, 0);
  addTaskDateInput.value = now.toISOString().slice(0, 16);

  const addTaskDate = document.createElement("img");
  addTaskDate.classList.add("add-task", "svg", "date");
  addTaskDate.src = images["calendar_options_default"];
  addTaskDate.alt = "Calendar Options";

  const addTaskPriorityLabel = document.createElement("div");
  addTaskPriorityLabel.classList.add("add-task", "priority", "label", "hidden");

  const addTaskPriorityDialog = createPriorityDialog();

  const addTaskPriority = document.createElement("img");
  addTaskPriority.classList.add("add-task", "svg", "priority");
  addTaskPriority.src = images["priority_flag_default"];
  addTaskPriority.alt = "Priority Options";

  addTaskDateLabel.append(addTaskDate, addTaskDateInput);
  addTaskPriorityLabel.append(addTaskPriority, addTaskPriorityDialog);
  addTaskOptionsContainer.append(addTaskDateLabel, addTaskPriorityLabel);
  addTaskBarContainer.append(addTaskBar, addTaskOptionsContainer);

  // pressing on the icon shows the date-picker
  addTaskDateLabel.addEventListener("mousedown", (e) => {
    e.preventDefault();
    addTaskDateInput.showPicker();
    addTaskDateInput.focus();
  });

  // adds pseudo-focus state on input field when date-picker is open
  addTaskDateInput.addEventListener("focus", () => {
    addTaskBar.classList.add("focus");
  });

  // remove pseudo-focus state on date-picker close and refocus the task bar
  addTaskDateInput.addEventListener("blur", () => {
    if (addTaskDateInput.value != "")
      addTaskDate.src = images["calendar_options_selected"];
    else addTaskDate.src = images["calendar_options_default"];

    addTaskBar.classList.remove("focus");
    addTaskBar.focus();
  });

  // same as date picker logic
  addTaskPriorityLabel.addEventListener("mousedown", (e) => {
    e.preventDefault();
    addTaskPriorityDialog.show();
    addTaskPriorityDialog.focus();
  });

  addTaskPriorityDialog.addEventListener("focus", () => {
    addTaskBar.classList.add("focus");
  });

  addTaskPriorityDialog.addEventListener("blur", () => {
    addTaskPriorityDialog.close();
    addTaskBar.classList.remove("focus");
    addTaskBar.focus();
    // if timeout is not used, the value of the priority will not be read correctly
    setTimeout(changePriority, 0);
  });

  // toggles the icons on input focus or unfocus
  addTaskBar.addEventListener("focus", () => {
    if (addTaskOptionsContainer.classList.contains("hidden")) {
      addTaskOptionsContainer.classList.remove("hidden");
      addTaskDateLabel.classList.remove("hidden");
      addTaskPriorityLabel.classList.remove("hidden");
    }
  });

  addTaskBar.addEventListener("focusout", () => {
    // necessary to allow the date picker to trigger without the blur interfering
    setTimeout(hideAddTaskBarIcons, 0);
  });

  const hideAddTaskBarIcons = function () {
    // hide icons only if no values are in the task bar
    if (
      addTaskBar.value.trim() == "" &&
      addTaskDateInput != document.activeElement &&
      addTaskPriorityDialog != document.activeElement
    ) {
      addTaskOptionsContainer.classList.add("hidden");
      addTaskDateLabel.classList.add("hidden");
      addTaskPriorityLabel.classList.add("hidden");
    }
  };

  const changePriority = function () {
    const imgs = [
      images["priority_flag_default"],
      images["priority_flag_low"],
      images["priority_flag_medium"],
      images["priority_flag_high"],
    ];
    const priority = document.querySelector(
      '.priority-picker input[name="priority"]:checked'
    );
    addTaskPriority.src = imgs[priority.value];
  };
  return addTaskBarContainer;
}

function createPriorityDialog() {
  const dialog = document.createElement("dialog");
  dialog.classList.add("add-task", "priority-picker");

  const imgs = [
    images["priority_flag_default"],
    images["priority_flag_low"],
    images["priority_flag_medium"],
    images["priority_flag_high"],
  ];
  // 4 priority levels:
  // High - 3, Medium - 2, Low - 1, None - 0
  for (let i = 3; i >= 0; i--) {
    const label = document.createElement("label");
    const img = document.createElement("img");
    img.src = imgs[i];
    img.classList.add("add-task", "svg", "priority");
    const radio = document.createElement("input");
    radio.classList.add("hidden");
    radio.setAttribute("type", "radio");
    radio.setAttribute("name", "priority");
    radio.setAttribute("id", `priority${i}`);
    radio.setAttribute("value", i);
    if (i == 0) radio.setAttribute("checked", "checked");
    label.append(img, radio);
    dialog.appendChild(label);
  }

  return dialog;
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
    disableActiveTask();
    taskContainer.classList.add("active");
    hideTaskSeparator(taskContainer.dataset.task);
    clearSection("view-task-section");
    initViewTaskSection(task);
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
  linkCheckboxes();
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
  viewTaskPriority.src = images["priority_flag_default"];
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

// toggling task section checkbox also toggle view task section checkbox
function linkCheckboxes() {
  const tasksSection = document.getElementById("tasks-section");
  const viewTaskSection = document.getElementById("view-task-section");
  const taskCheckbox = tasksSection.querySelector(
    `.container.active .checkbox`
  );
  const viewTaskCheckbox = viewTaskSection.querySelector(
    ".header.container .checkbox"
  );
  const listIdx = Number(tasksSection.dataset.list);
  const taskIdx = Number(viewTaskSection.dataset.task);

  viewTaskCheckbox.checked = taskCheckbox.checked;
  taskCheckbox.addEventListener("click", () => {
    App.getLists()[listIdx].tasks[taskIdx].complete = taskCheckbox.checked;
    viewTaskCheckbox.checked = !viewTaskCheckbox.checked;
  });
  viewTaskCheckbox.addEventListener("click", () => {
    App.getLists()[listIdx].tasks[taskIdx].complete = viewTaskCheckbox.checked;
    taskCheckbox.checked = !taskCheckbox.checked;
  });
}
