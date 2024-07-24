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

export function addToCategoriesSection() {
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

  groupByListHeading.textContent = "Lists";
  groupByListHeading.classList.add("group-by", "list", "heading");

  addListIcon.id = "add-list";
  addListIcon.src = images["add_list"];

  groupByListHeading.appendChild(addListIcon);
  groupByListContainer.appendChild(groupByListHeading);
  for (const list of App.getLists()) {
    groupByListContainer.appendChild(openListOnClick(list));
  }
  return groupByListContainer;
}

function openListOnClick(list) {
  const listContainer = createGroupByItem(list.name, "list_icon", "list");
  listContainer.addEventListener("click", () => {
    clearSection("tasks-section");
    clearSection("view-task-section");
    addToTasksSection(list);
  });
  return listContainer;
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

function createGroupByItem(label, imgName, type) {
  const item = document.createElement("div");
  item.classList.add("group-by", "item", type);

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

export function addToTasksSection(list = App.getLists()[0]) {
  const tasksSectionContainer = document.getElementById("tasks-section");

  const taskSeparator = document.createElement("hr");
  taskSeparator.classList.add("horizontal", "task", "separator");

  tasksSectionContainer.append(
    createTaskSectionHeading(list.name),
    createAddTaskBar()
  );
  for (const task of list.tasks) {
    tasksSectionContainer.appendChild(openTaskOnClick(task));
    tasksSectionContainer.appendChild(taskSeparator.cloneNode(true));
  }
}

function openTaskOnClick(task) {
  console.log(task);
  const taskContainer = createTask(task);
  taskContainer.addEventListener("click", () => {
    clearSection("view-task-section");
    console.log(task);
    addToViewTaskSection(task);
  });
  return taskContainer;
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
  addTaskDate.classList.add("add-task", "svg");
  addTaskDate.src = images["calendar_options"];
  addTaskDate.alt = "Calendar Options";

  const addTaskProperties = document.createElement("img");
  addTaskProperties.classList.add("add-task", "svg");
  addTaskProperties.src = images["arrow_down"];
  addTaskProperties.alt = "Other Options";

  addTaskOptionsContainer.append(addTaskDate, addTaskProperties);

  addTaskBarContainer.append(addTaskBar, addTaskOptionsContainer);

  return addTaskBarContainer;
}

function createTask(task) {
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task", "container");

  const taskCheckboxLabel = document.createElement("label");
  const taskCheckbox = document.createElement("input");

  taskCheckbox.classList.add("task", "checkbox");
  taskCheckbox.type = "checkbox";
  taskCheckbox.checked = task.complete;
  taskCheckboxLabel.appendChild(taskCheckbox);

  const taskDetailsContainer = document.createElement("div");
  taskDetailsContainer.classList.add("task-details", "container");

  const taskName = document.createElement("span");
  const taskDueDate = document.createElement("span");
  taskName.classList.add("task", "name");
  taskDueDate.classList.add("task", "due-date");
  taskName.textContent = task.name;
  taskDueDate.textContent = task.dueDate.toDateString();

  taskDetailsContainer.append(taskName, taskDueDate);
  taskContainer.append(taskCheckboxLabel, taskDetailsContainer);

  return taskContainer;
}

export function addToViewTaskSection(task) {
  console.log(task);
  const viewTaskSection = document.getElementById("view-task-section");
  const horizontalSeparator = document.createElement("hr");
  horizontalSeparator.classList.add("horizontal", "view-task", "separator");
  viewTaskSection.append(
    createViewTaskHeader(task.dueDate),
    horizontalSeparator,
    createViewTaskBody(task.name, task.desc)
  );
}

function createViewTaskHeader(dueDate) {
  const viewTaskHeaderContainer = document.createElement("div");
  viewTaskHeaderContainer.classList.add("view-task", "header", "container");

  const checkboxLabel = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.classList.add("view-task", "checkbox");
  checkbox.type = "checkbox";

  checkboxLabel.appendChild(checkbox);

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
      addToCategoriesSection();
    }
  });
}
