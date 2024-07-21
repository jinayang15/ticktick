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
  const sectionContainer = document.getElementById(id);
  if (sectionContainer) sectionContainer.remove();
}

export function addCategoriesSection() {
  const contentContainer = document.getElementById("content");
  const categoriesSectionContainer = document.createElement("div");
  const hrSeparator = document.createElement("hr");

  categoriesSectionContainer.id = "categories-section";

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

  contentContainer.prepend(categoriesSectionContainer);
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

  groupByListHeading.textContent = "Lists";
  groupByListHeading.classList.add("group-by", "list", "heading");
  groupByListContainer.append(
    groupByListHeading,
    createGroupByItem("Default", "home_storage", "list")
  );

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

export function addToTasksSection() {
  const tasksSectionContainer = document.getElementById("tasks-section");

  const taskSeparator = document.createElement("hr");
  taskSeparator.classList.add("horizontal", "task", "separator");

  tasksSectionContainer.append(createTaskSectionHeading(), createAddTaskBar());
  tasksSectionContainer.appendChild(createTask(false, "Blah Blah", "Today"));
  tasksSectionContainer.appendChild(taskSeparator.cloneNode(true));
}

function createTaskSectionHeading(listName = "Default") {
  const tasksHeadingContainer = document.createElement("div");
  tasksHeadingContainer.classList.add("tasks", "heading", "container");

  const menuToggle = document.createElement("img");
  menuToggle.classList.add("tasks", "heading", "svg");
  menuToggle.src = images["menu_collapse"];
  menuToggle.alt = "Menu Collapse";

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

function createTask(done, name, dueDate) {
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task", "container");

  const taskCheckboxLabel = document.createElement("label");
  const taskCheckbox = document.createElement("input");

  taskCheckbox.classList.add("task", "checkbox");
  taskCheckbox.type = "checkbox";
  taskCheckbox.checked = done;
  taskCheckboxLabel.appendChild(taskCheckbox);

  const taskDetailsContainer = document.createElement("div");
  taskDetailsContainer.classList.add("task-details", "container");

  const taskName = document.createElement("span");
  const taskDueDate = document.createElement("span");
  taskName.classList.add("task", "name");
  taskDueDate.classList.add("task", "due-date");
  taskName.textContent = name;
  taskDueDate.textContent = dueDate;

  taskDetailsContainer.append(taskName, taskDueDate);
  taskContainer.append(taskCheckboxLabel, taskDetailsContainer);

  return taskContainer;
}
