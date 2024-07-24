import { Todo, List } from "./class";
import * as App from "./app";
import * as Logic from "./logic";
import * as Display from "./display";
import "./reset.css";
import "./styles.css";

function main() {
  const defaultList = new List("default");
  const newList = new List("new");
  App.addList(defaultList);
  App.addList(newList);

  Display.addToCategoriesSection("categories-section");
  Display.addToViewTaskSection();

  Display.addMenuToggle();
}

main();
