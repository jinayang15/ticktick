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
      new Date(2024, 7, 17),
      true,
      0,
      true
    ),
    new Task(
      1,
      "hallohallo",
      "duuuduuuduu",
      new Date(2024, 5, 13),
      false,
      0,
      false
    )
  );

  Display.initCategoriesSection();
}

main();
