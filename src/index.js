import { Todo, List } from "./class";
import * as App from "./app";
import * as Logic from "./logic";
import * as Display from "./display";
import "./reset.css";
import "./styles.css";

function main() {
  const defaultList = new List("default");
  App.addList(defaultList);

  const contentContainer = document.getElementById("content");
  contentContainer.appendChild(Display.createCategoriesContainer());
  // Output.intro();
  // for (let i = 0; i < 3; i++) {
  //   Output.printListActions();
  // }
}

main();
