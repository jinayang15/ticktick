import {
  isBefore,
  toDate,
  differenceInCalendarDays,
  formatDistanceToNow,
  setDate,
} from "date-fns";
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

function getListIdx() {
  const tasksSection = document.getElementById("tasks-section");
  if (tasksSection) {
    const listIdx = Number(tasksSection.dataset.list);
    return listIdx;
  }
  return null;
}

function getTaskIdx() {
  const viewTaskSection = document.getElementById("view-task-section");
  if (viewTaskSection) {
    const taskIdx = Number(viewTaskSection.dataset.task);
    return taskIdx;
  }
  return null;
}

export function initCategoriesSection() {
  const categoriesSection = document.getElementById("categories-section");
  const hrSeparator = document.createElement("hr");

  categoriesSection.classList.remove("hidden");

  hrSeparator.classList.add("horizontal", "categories", "separator");

  const groupByListContainer = document.createElement("div");
  groupByListContainer.classList.add("group-by", "list", "container");
  groupByListContainer.id = "group-by-list";

  categoriesSection.append(
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
  const listIdx = getListIdx();
  App.deleteList(listIdx);
  clearSection("tasks-section");
  clearSection("group-by-list");
  addToGroupByList();
}

export function initTasksSection(list) {
  const tasksSection = document.getElementById("tasks-section");
  tasksSection.dataset.list = list.idx;

  const tasksContainer = document.createElement("div");
  tasksContainer.classList.add("tasks", "container");
  tasksContainer.id = "tasks-container";

  tasksSection.append(
    createTaskSectionHeading(list.name),
    createAddTaskBar(),
    tasksContainer
  );
  addToTasks();
  addMenuToggle();
}

function addToTasks() {
  const listIdx = getListIdx();
  const list = App.getLists()[listIdx];

  const taskSeparator = document.createElement("hr");
  taskSeparator.classList.add("horizontal", "task", "separator");

  const tasksContainer = document.getElementById("tasks-container");

  for (let i = 0; i < list.tasks.length; i++) {
    list.tasks[i].idx = i;
    taskSeparator.dataset.task = i;
    tasksContainer.append(
      createTaskClickable(list.tasks[i]),
      taskSeparator.cloneNode(true)
    );
  }
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

function createTaskSectionHeading(listName) {
  const tasksHeadingContainer = document.createElement("div");
  tasksHeadingContainer.classList.add("tasks", "section", "heading");

  const menuToggle = document.createElement("img");
  menuToggle.classList.add("tasks", "heading", "svg");
  menuToggle.src = images["menu_collapse"];
  menuToggle.alt = "Menu Collapse";
  menuToggle.id = "menu-toggle";

  const tasksListName = document.createElement("span");
  tasksListName.classList.add("tasks", "heading", "text");
  tasksListName.textContent = listName;

  const more = createListMoreDropdown();

  tasksHeadingContainer.append(
    menuToggle,
    tasksListName,
    more.button,
    more.dropdown
  );

  return tasksHeadingContainer;
}

function createMoreDropdown(sectionName) {
  const moreButton = document.createElement("img");
  moreButton.classList.add(sectionName, "heading", "svg");
  moreButton.src = images["more_hori"];
  moreButton.alt = "More";

  const moreDropdown = document.createElement("dialog");
  moreDropdown.classList.add(sectionName, "more-dropdown");

  moreButton.addEventListener("click", () => {
    moreDropdown.show();
    moreDropdown.focus();
  });
  moreDropdown.addEventListener("blur", () => {
    moreDropdown.close();
  });

  return { button: moreButton, dropdown: moreDropdown };
}

function createListMoreDropdown() {
  const moreStuff = createMoreDropdown("tasks");

  const moreButton = moreStuff.button;

  const moreDropdown = moreStuff.dropdown;

  // more dropdown items
  const moreDropdownDelete = createMoreItem("delete", "Delete", "Delete List");

  moreDropdown.append(moreDropdownDelete);

  // dropdown item eventlisteners
  moreDropdownDelete.addEventListener("click", () => {
    deleteList();
    moreDropdown.open = false;
  });

  return { button: moreButton, dropdown: moreDropdown };
}

function createMoreItem(name, text, alt) {
  const moreDropdownItem = document.createElement("div");
  moreDropdownItem.classList.add("more-dropdown", "item", "container", name);

  const itemSvg = document.createElement("img");
  itemSvg.classList.add("more-dropdown", "item", "svg", name);
  itemSvg.src = images[name];
  itemSvg.alt = alt;

  const itemText = document.createElement("span");
  itemText.classList.add("more-dropdown", "item", "text", name);
  itemText.textContent = text;

  moreDropdownItem.append(itemSvg, itemText);

  return moreDropdownItem;
}

function createAddTaskBar() {
  const addTaskBarContainer = document.createElement("form");
  addTaskBarContainer.classList.add("add-task", "input", "container");

  const addTaskBar = document.createElement("input");
  addTaskBar.id = "add-task";
  addTaskBar.name = "add-task";
  addTaskBar.type = "text";
  addTaskBar.placeholder = "+ Add Task";
  addTaskBar.required = true;
  addTaskBar.setAttribute("pattern", ".{1,}");

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

  // Event Listeners
  // add new task when submitted
  addTaskBarContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewTask();
  });

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

  // named functions
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

  const resetForm = function () {
    // reset form values
    addTaskBarContainer.reset();
    // set default time to 12AM
    let now = new Date();
    now.setUTCHours(0, 0, 0);
    addTaskDateInput.value = now.toISOString().slice(0, 16);
    // reset calendar options icon
    addTaskDate.src = images["calendar_options_default"];
    // reset priority flag icon
    changePriority();
  };

  const addNewTask = function () {
    const listIdx = getListIdx();
    const list = App.getLists()[listIdx];
    const taskIdx = list.tasks.length;
    const name = addTaskBar.value;
    let date = addTaskDateInput.value;
    const priority = addTaskPriorityDialog.querySelector(":checked").value;
    let useTime = false;

    if (addTaskDate.src != images["calendar_options_default"]) {
      date = toDate(addTaskDateInput.value);
      const hour = date.getHours();
      const minute = date.getMinutes();
      useTime = hour != 0 || minute != 0;
    } else {
      date = null;
    }
    const task = new Task(taskIdx, name, "", date, useTime, priority, false);
    list.addTask(task);
    displayNewTask();
    resetForm();
  };

  return addTaskBarContainer;
}

function createTask(task) {
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task", "container");
  taskContainer.dataset.task = task.idx;
  taskContainer.dataset.priority = task.priority;

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
  taskDueDate.textContent = displayTaskDueDate(task.dueDate, task.useTime);
  if (isBefore(task.dueDate, new Date())) taskDueDate.style.color = "#c30000";
  else taskDueDate.style.color = "#4872f9";

  taskDetailsContainer.append(taskName, taskDueDate);
  taskContainer.append(taskCheckboxLabel, taskDetailsContainer);

  return taskContainer;
}

function displayTaskDueDate(dueDate, useTime) {
  let output = "";
  if (dueDate) {
    const numDaysUntil = differenceInCalendarDays(dueDate, new Date());
    if (numDaysUntil < 0) {
      if (numDaysUntil == -1) {
        if (useTime) {
          output = formatDistanceToNow(dueDate) + " overdue";
          // capitalize first character
          output = output.charAt(0).toUpperCase() + output.slice(1);
        } else output = "Yesterday";
      } else output = Math.abs(numDaysUntil) + " days overdue";
    } else if (numDaysUntil > 0) {
      if (numDaysUntil == 1) {
        if (useTime) {
          output = formatDistanceToNow(dueDate) + " left";
          // capitalize first character
          output = output.charAt(0).toUpperCase() + output.slice(1);
        } else output = "Tomorrow";
      } else output = numDaysUntil + " days left";
    } else {
      if (useTime) {
        output = formatDistanceToNow(dueDate);
        // capitalize first letter
        output = output.charAt(0).toUpperCase() + output.slice(1);
        if (isBefore(dueDate, new Date())) output += " overdue";
        else output += " left";
      } else output = "Today";
    }
  }
  return output;
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

function displayNewTask() {
  const tasksContainer = document.getElementById("tasks-container");
  const listIdx = getListIdx();
  const list = App.getLists()[listIdx];
  const newTask = list.tasks[list.tasks.length - 1];

  const taskSeparator = document.createElement("hr");
  taskSeparator.classList.add("horizontal", "task", "separator");
  taskSeparator.dataset.task = newTask.idx;

  tasksContainer.append(createTaskClickable(newTask), taskSeparator);
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
  for (let i = imgs.length - 1; i >= 0; i--) {
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
  viewTaskSection.dataset.priority = task.priority;
  const horizontalSeparator = document.createElement("hr");
  horizontalSeparator.classList.add("horizontal", "view-task", "separator");
  viewTaskSection.append(
    createViewTaskHeading(task),
    horizontalSeparator,
    createViewTaskBody(task.name, task.desc)
  );
  saveTaskOnEdit(viewTaskSection);
  linkCheckboxes();
}

function createViewTaskHeading(task) {
  const viewTaskHeadingContainer = document.createElement("div");
  viewTaskHeadingContainer.classList.add("view-task", "heading", "container");

  const checkboxLabel = document.createElement("label");
  const checkbox = document.createElement("input");
  const checkmark = document.createElement("span");
  checkbox.classList.add("view-task", "checkbox");
  checkbox.type = "checkbox";
  checkmark.classList.add("checkmark");
  checkboxLabel.append(checkbox, checkmark);

  const verticalSeparator = document.createElement("hr");
  verticalSeparator.classList.add("vertical", "view-task", "separator");

  const viewTaskDateContainer = document.createElement("label");
  viewTaskDateContainer.classList.add("view-task", "date", "container");

  const viewTaskDueDateIcon = document.createElement("img");
  viewTaskDueDateIcon.classList.add("view-task", "heading", "svg");
  viewTaskDueDateIcon.src = images["calendar_icon_default"];

  const viewTaskDueDate = document.createElement("span");
  viewTaskDueDate.classList.add("view-task", "due-date");

  const viewTaskDateInput = document.createElement("input");
  viewTaskDateInput.setAttribute("type", "datetime-local");
  viewTaskDateInput.classList.add("view-task", "date-picker");

  viewTaskDateContainer.append(
    viewTaskDueDateIcon,
    viewTaskDueDate,
    viewTaskDateInput
  );

  viewTaskDateContainer.addEventListener("mousedown", (e) => {
    e.preventDefault();
    viewTaskDateInput.showPicker();
    viewTaskDateInput.focus();
  });

  // update date display on date change
  viewTaskDateInput.addEventListener("blur", () => {
    const listIdx = getListIdx();
    const taskIdx = getTaskIdx();
    const task = App.getLists()[listIdx].tasks[taskIdx];
    let dueDate;
    let useTime = false;
    if (viewTaskDateInput.value != "") {
      dueDate = toDate(viewTaskDateInput.value);
      const hour = dueDate.getHours();
      const minute = dueDate.getMinutes();
      useTime = hour != 0 || minute != 0;
    } else {
      dueDate = null;
    }
    task.dueDate = dueDate;
    task.useTime = useTime;
    displayDueDate(dueDate, useTime);

    const taskText = document.querySelector(
      "#tasks-section .task.active .due-date"
    );
    taskText.textContent = displayTaskDueDate(dueDate, useTime);
    if (isBefore(dueDate, new Date())) taskText.style.color = "#c30000";
    else taskText.style.color = "#4872f9";
  });

  const viewTaskPriority = document.createElement("img");
  viewTaskPriority.classList.add("view-task", "heading", "svg");
  viewTaskPriority.src = images["priority_flag_default"];
  viewTaskPriority.alt = "Priority";

  const moreDropdown = createTaskMoreDropdown();

  viewTaskHeadingContainer.append(
    checkboxLabel,
    verticalSeparator,
    viewTaskDateContainer,
    viewTaskPriority,
    moreDropdown.button,
    moreDropdown.dropdown
  );

  const displayDueDate = function (dueDate, useTime) {
    if (dueDate) {
      viewTaskDueDateIcon.src = images["calendar_icon_active"];
      viewTaskDueDate.style.color = "#4872f9";
      viewTaskDueDate.textContent = dueDate.toDateString();
      if (useTime)
        viewTaskDueDate.textContent += ", " + dueDate.toLocaleTimeString();
      if (isBefore(dueDate, new Date())) {
        viewTaskDueDate.style.color = "#c30000";
        viewTaskDueDateIcon.src = images["calendar_icon_late"];
      }
    } else {
      viewTaskDueDateIcon.src = images["calendar_icon_default"];
      viewTaskDueDate.style.color = "#858585";
      viewTaskDueDate.textContent = "Due Date";
    }
  };

  const setDatePickerValue = function (dueDate) {
    if (dueDate) {
      // convert to milliseconds
      const offset = new Date().getTimezoneOffset() * 60 * 1000;
      // need to adjust time to match local time
      const adjustedTime = new Date(dueDate - offset);
      viewTaskDateInput.value = adjustedTime.toISOString().slice(0, 16);
    } else {
      let now = new Date();
      now.setUTCHours(0, 0, 0);
      viewTaskDateInput.value = now.toISOString().slice(0, 16);
    }
  };

  displayDueDate(task.dueDate, task.useTime);
  setDatePickerValue(task.dueDate);

  return viewTaskHeadingContainer;
}

function createTaskMoreDropdown() {
  const moreStuff = createMoreDropdown("view-task");

  const moreButton = moreStuff.button;

  const moreDropdown = moreStuff.dropdown;

  // more dropdown items
  const moreDropdownDelete = createMoreItem("delete", "Delete", "Delete List");

  moreDropdown.append(moreDropdownDelete);

  // dropdown item eventlisteners
  moreDropdownDelete.addEventListener("click", () => {
    deleteTask();
    moreDropdown.open = false;
  });

  return { button: moreButton, dropdown: moreDropdown };
}

function createViewTaskBody(name, desc) {
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

function deleteTask() {
  const listIdx = getListIdx();
  const taskIdx = getTaskIdx();
  App.getLists()[listIdx].deleteTask(taskIdx);
  clearSection("view-task-section");
  clearSection("tasks-container");
  addToTasks();
}

function saveTaskOnEdit(viewTaskSection) {
  const taskName = viewTaskSection.querySelector(".name");
  const taskDesc = viewTaskSection.querySelector(".description");

  taskName.addEventListener("input", () => {
    const listIdx = getListIdx();
    const taskIdx = getTaskIdx();
    const clickableTaskName = document.querySelector(
      `.task.container[data-task='${taskIdx}'] .name`
    );

    const lists = App.getLists();
    lists[listIdx].tasks[taskIdx].name = taskName.textContent;
    clickableTaskName.textContent = taskName.textContent;
  });

  taskDesc.addEventListener("input", () => {
    const listIdx = getListIdx();
    const taskIdx = getTaskIdx();
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

  saveButton.addEventListener("click", (e) => {
    e.preventDefault();
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
  const taskCheckbox = document.querySelector(
    `.task.container.active .checkbox`
  );
  const viewTaskCheckbox = document.querySelector(
    ".view-task.heading.container .checkbox"
  );
  const listIdx = getListIdx();
  const taskIdx = getTaskIdx();

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
