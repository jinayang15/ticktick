const images = importAllAssets(
  require.context("./assets", false, /\.(png|jpe?g|svg)$/)
);
console.table(images);

function importAllAssets(r) {
  const paths = r.keys();
  const images = {};
  paths.forEach((path) => {
    const key = path.replace("./", "").replace(/\.(png|jpe?g|svg)$/, "");
    images[key] = r(path);
  });
  return images;
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

export function clearCategoriesSection() {
  const categoriesSectionContainer =
    document.getElementById("categories-section");
  if (categoriesSectionContainer) categoriesSectionContainer.remove();
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

function addToTasksSection() {
  const taskSectionContainer = document.getElementById("tasks-section");
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
  const addTaskBar = document.createElement("add-task", "input", "container");
}
