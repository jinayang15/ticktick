import List from "./list";
import Task from "./task";
import * as App from "./app";
import * as Display from "./display";
import "./reset.css";
import "./styles.css";

function main() {
  const defaultList = new List(0, "Default");
  const newList = new List(1, "new");
  App.addList(defaultList, newList);
  defaultList.addTask(
    new Task(
      0,
      "boop",
      "dfsfsdfsfsdfserwerwe",
      new Date(2024, 7, 17),
      false,
      0,
      true,
      defaultList
    ),
    new Task(
      1,
      "hallohallo",
      "duuuduuuduu",
      new Date(2024, 5, 13),
      false,
      0,
      false,
      defaultList
    )
  );
  App.sortTasksIntoPresetLists();
  Display.initCategoriesSection();
}

main();
