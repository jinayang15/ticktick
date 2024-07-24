import { Task, List } from "./class";
import * as App from "./app";
import * as Logic from "./logic";
import * as Display from "./display";
import "./reset.css";
import "./styles.css";

function main() {
  const defaultList = new List("Default");
  const newList = new List("new");
  App.addList(defaultList, newList);
  defaultList.addTask(
    new Task(
      "boop",
      "dfsfsdfsfsdfserwerwe",
      new Date(2024, 1, 20),
      false,
      0,
      true
    )
  );
  console.log(defaultList.tasks[0].printDetailed());

  Display.addToCategoriesSection();
  Display.addToTasksSection();

  Display.addMenuToggle();
}

main();
