import * as App from "./app";
import { List } from "./class";

const _listActions = [printAccessList, printAddList, printDeleteList];

export function intro() {
  console.log("Welcome to To-Do List!");
}

export function handleListActions() {
  console.log("1. Access an available list");
  console.log("2. Add new list");
  console.log("3. Delete a list");
  console.log(" ");
  let choice = Number(prompt("Pick an option using the number: "));
  while (!choice || choice < 1 || choice > _listActions.length) {
    choice = Number(prompt("Please pick between one of the options!"));
  }
  _listActions[choice - 1]();
}

function printAccessList() {
  const lists = App.getLists();
  for (let i = 0; i < lists.length; i++) {
    console.log(`${i + 1}. ${lists[i].name}`);
  }
  console.log(" ");
  let choice = Number(prompt("Please choose a list to access: "));
  while (!choice || choice < 1 || choice > lists.length) {
    choice = Number(prompt("Please pick between one of the options!"));
  }
}

function printAddList() {
  const name = prompt("Please choose a name for your new list: ");
  const newList = new List(name);
  App.addList(newList);
  console.log("List has been added.");
}

function printDeleteList() {
  const lists = App.getLists();
  if (lists.length > 0) {
    for (let i = 0; i < lists.length; i++) {
      console.log(`${i + 1}. ${lists[i].name}`);
    }
    console.log(" ");
    let choice = Number(prompt("Please choose a list to delete: "));
    while (!choice || choice < 1 || choice > lists.length) {
      choice = Number(prompt("Please pick between one of the options!"));
    }
    App.deleteList(choice - 1);
    console.log("List has been removed.");
  } else {
    console.log("No lists to remove.");
  }
}
