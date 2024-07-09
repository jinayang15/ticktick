import { Task, List } from "./class";
import * as App from "./app";
import * as Output from "./output";

function main() {
  const defaultList = new List("default");
  App.addList(defaultList);

  Output.intro();
  Output.handleListActions();
}

main();
