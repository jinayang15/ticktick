import * as App from "./app";
import { Todo, List } from "./class";

const _listActions = [printAccessList, printAddList, printDeleteList];
const _toDoActions = [printAccessTodo, printAddTodo];

export function intro() {
  console.log("Welcome to To-Do List!");
}

export function printListActions() {
  console.log("1. Access an available list");
  console.log("2. Add new list");
  console.log("3. Delete a list");
  console.log(" ");
  let choice = Number(prompt("Pick an option using the number: "));
  while (!checkChoice(choice, 1, 3)) {
    choice = Number(prompt("Please pick between one of the numbers!"));
  }
  _listActions[choice - 1]();
}

function printAccessList() {
  const lists = App.getLists();
  if (lists.length > 0) {
    for (let i = 0; i < lists.length; i++) {
      console.log(`${i + 1}. ${lists[i].name}`);
    }
    console.log(" ");
    let choice = Number(prompt("Please choose a list to access: "));
    while (!checkChoice(choice, 1, lists.length)) {
      choice = Number(prompt("Please pick between one of the numbers!"));
    }
    printToDoActions(lists[choice - 1]);
  } else {
    console.log("No lists to access.");
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
    while (!checkChoice(choice, 1, lists.length)) {
      choice = Number(prompt("Please pick between one of the numbers!"));
    }
    App.deleteList(choice - 1);
    console.log("List has been removed.");
  } else {
    console.log("No lists to remove.");
  }
}

function printToDoActions(list) {
  console.log("1. Access/Edit a to-do");
  console.log("2. Add a to-do");
  console.log("3. Delete a to-do");
  console.log(" ");
  let choice = Number(prompt("Pick an option using a number: "));
  while (!checkChoice(choice, 1, 3)) {
    choice = Number(prompt("Please pick between one of the numbers!"));
  }
  _toDoActions[choice - 1](list);
}

function printAccessTodo(list) {
  const todos = list.todos;
  if (todos.length > 0) {
    for (let i = 0; i < todos.length; i++) {
      console.log(`${i + 1}.${todos[i]}`);
    }
    console.log(" ");
    let choice = Number(prompt("Please choose a to-do to access: "));
    while (!checkChoice(choice, 1, todos.length)) {
      choice = Number(prompt("Please pick between one of the numbers!"));
    }
    printEditTodo(todos[choice - 1]);
  } else {
    console.log("No to-dos to access.");
  }
}

function printEditTodo(todo) {
  console.log(todo.printDetailed());
  let choice = prompt("Would you like to edit the to-do? (y/n)");
  choice = choice.toLowerCase();
  while (choice != "y" && choice != "n") {
    choice = prompt("Please choose 'y' or 'n'");
  }
  if (choice == "y") {
    console.log("1. Name");
    console.log("2. Description");
    console.log("3. Due Date");
    console.log("4. Time");
    console.log("5. Priority");
    console.log("6. Complete");
    let choice = Number(prompt("Which attribute would you like to edit?"));
    while (!checkChoice(choice, 1, 6)) {
      choice = Number(prompt("Please pick between one of the numbers!"));
    }
  }
}

function printAddTodo(list) {
  const name = prompt("Name: ");
  const desc = prompt("Description: ");
  let dueDate = prompt("Enter due date (YYYY/MM/DD)");
  let testDate = new Date(dueDate);
  while (!checkValidDate(testDate)) {
    console.log(testDate);
    dueDate = prompt("Please enter a valid date.");
    testDate = new Date(dueDate);
  }
  let addTime = prompt("Would you like to add a time? (y/n)");
  addTime = addTime.toLowerCase();
  while (addTime != "y" && addTime != "n") {
    addTime = prompt("Please choose 'y' or 'n'");
  }

  if (addTime == "y") {
    let time = prompt("Add a time in 24-hour format (HH:MM): ");
    let testTime = new Date(dueDate + " " + time);
    while (!checkValidDate(testTime)) {
      console.log(testTime);
      time = prompt("Please enter a valid time.");
      testTime = new Date(dueDate + " " + time);
    }
    dueDate = dueDate + " " + time;
  }
  dueDate = new Date(dueDate);
  console.log(dueDate);

  let priority = Number(
    prompt("Choose priority level (0 - lowest, 3 - highest): ")
  );
  while (!checkChoice(priority, 0, 3)) {
    priority = Number(prompt("Please pick between one of the numbers!"));
  }
  const complete = false;
  const newTodo = new Todo(name, desc, dueDate, priority, complete);
  list.addTodo(newTodo);
}

function checkChoice(choice, lowBound, highBound) {
  return choice >= lowBound && choice <= highBound && choice % 1 == 0;
}

function checkValidDate(date) {
  return date instanceof Date && !isNaN(date);
}
