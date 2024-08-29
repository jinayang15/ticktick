import List from "./list";
import Task from "./task";
import * as App from "./app";
import * as Display from "./display";
import { toDate } from "date-fns";
import "./reset.css";
import "./styles.css";

window.addEventListener("beforeunload", saveListsOnClose);

function saveListsOnClose() {
  for (const list of App.getLists()) {
    const jsonString = JSON.stringify(list, function (key, value) {
      if (key == "_listParent") return list.idx;
      else return value;
    });
    localStorage.setItem(list.idx, jsonString);
  }
}

function addListsFromLocalStorage() {
  for (let i = 0; i < localStorage.length; i++) {
    const listJSON = JSON.parse(localStorage[i]);
    App.addList(convertJSONtoList(listJSON));
  }
}

function convertJSONtoList(json) {
  const list = new List(json._idx, json._name, json._tasks);
  for (let i = 0; i < list.tasks.length; i++) {
    const taskJSON = list.tasks[i];
    list.tasks[i] = convertJSONtoTask(list, taskJSON);
  }
  return list;
}

function convertJSONtoTask(list, json) {
  let dueDate = json._dueDate;
  if (json._dueDate) dueDate = toDate(json._dueDate);
  else dueDate = null;
  const task = new Task(
    json._idx,
    json._name,
    json._desc,
    dueDate,
    json._useTime,
    json._priority,
    json._complete,
    list
  );
  return task;
}

function main() {
  addListsFromLocalStorage();
  App.sortTasksIntoPresetLists();
  Display.initCategoriesSection();
}

main();
