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

export function createCategoriesContainer() {
  const categoriesContainer = document.createElement("div");
  const hrSeparator = document.createElement("hr");

  hrSeparator.classList.add("horizontal", "categories", "separator");
  categoriesContainer.classList.add("categories", "section", "container");

  categoriesContainer.appendChild(createGroupByPeriod());
  categoriesContainer.appendChild(hrSeparator);
  categoriesContainer.appendChild(createGroupByList());

  return categoriesContainer;
}

function createGroupByPeriod() {
  const groupByPeriodContainer = document.createElement("div");
  groupByPeriodContainer.classList.add("group-by", "period", "container");
  groupByPeriodContainer.appendChild(
    createGroupByItem("Today", "calendar_view_day", "period")
  );
  groupByPeriodContainer.appendChild(
    createGroupByItem("Next 7 Days", "calendar_view_week", "period")
  );
  groupByPeriodContainer.appendChild(
    createGroupByItem("All Tasks", "all_task_list", "period")
  );
  return groupByPeriodContainer;
}

function createGroupByList() {
  const groupByListContainer = document.createElement("div");
  const groupByListHeading = document.createElement("h4");

  groupByListHeading.textContent = "Lists";
  groupByListHeading.classList.add("group-by", "list", "heading");
  groupByListContainer.appendChild(
    createGroupByItem("Default", "home_storage", "list")
  );
  return groupByListContainer;
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
