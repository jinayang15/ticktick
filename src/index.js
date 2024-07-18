import { Todo, List } from "./class";
import * as App from "./app";
import * as Output from "./output";
import "./reset.css";
import "./styles.css";

function importAllAssets(r) {
  
}


function main() {
  const defaultList = new List("default");
  App.addList(defaultList);

  Output.intro();
  for (let i = 0; i < 3; i++) {
    Output.printListActions();
  }
}
