import { Task, List } from "./class";
import * as App from "./app";
import * as Logic from "./logic";
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
      new Date(2024, 1, 20),
      false,
      0,
      true
    )
  );
  console.log(defaultList.tasks[0].printDetailed());

  Display.initCategoriesSection();
  Display.initTasksSection();
}

main();
