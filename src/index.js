import { Todo, List } from "./class";
import * as App from "./app";
import * as Logic from "./logic";
import * as Display from "./display";
import "./reset.css";
import "./styles.css";

function main() {
  const defaultList = new List("default");
  App.addList(defaultList);

  Display.addCategoriesSection();
  Display.addToTasksSection();
  Display.addToViewTaskSection();
}

main();
