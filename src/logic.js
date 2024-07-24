import * as App from "./app";
import { Task, List } from "./class";

export function intro() {
  console.log("Welcome to To-Do List!");
}

export function printListActions() {
  // use an array of functions for easy access
  const listActions = [printAccessList, printAddList, printDeleteList];
  console.log("1. Access an available list");
  console.log("2. Add new list");
  console.log("3. Delete a list");
  console.log(" ");
  let choice = Number(prompt("Pick an option using the number: "));
  while (!checkChoice(choice, 1, 3)) {
    choice = Number(prompt("Please pick between one of the numbers!"));
  }
  listActions[choice - 1]();
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
  // use an array of functions for easy access
  const toDoActions = [printAccessTodo, printAddTodo, printDeleteTodo];
  console.log("1. Access/Edit a to-do");
  console.log("2. Add a to-do");
  console.log("3. Delete a to-do");
  console.log(" ");
  let choice = Number(prompt("Pick an option using a number: "));
  while (!checkChoice(choice, 1, 3)) {
    choice = Number(prompt("Please pick between one of the numbers!"));
  }
  toDoActions[choice - 1](list);
}

function printAccessTodo(list) {
  const todos = list.todos;
  if (todos.length > 0) {
    for (let i = 0; i < todos.length; i++) {
      console.log(`${i + 1}. ${todos[i]}`);
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
  console.log(" ");
  let choice = prompt("Would you like to edit the to-do? (y/n)");
  choice = choice.toLowerCase();
  while (choice != "y" && choice != "n") {
    choice = prompt("Please choose 'y' or 'n'");
  }
  if (choice == "y") {
    const editTodoActions = [
      editTodoName,
      editTodoDesc,
      editTodoDueDate,
      editTodoPriority,
      editTodoComplete,
    ];
    console.log("1. Name");
    console.log("2. Description");
    console.log("3. Due Date/Time");
    console.log("4. Priority");
    console.log("5. Complete");
    console.log(" ");
    let choice = Number(prompt("Which attribute would you like to edit?"));
    while (!checkChoice(choice, 1, 5)) {
      choice = Number(prompt("Please pick between one of the numbers!"));
    }
    editTodoActions[choice - 1](todo);
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
    addTime = true;
    let time = prompt("Add a time in 24-hour format (HH:MM): ");
    let testTime = new Date(dueDate + " " + time);
    while (!checkValidDate(testTime)) {
      console.log(testTime);
      time = prompt("Please enter a valid time.");
      testTime = new Date(dueDate + " " + time);
    }
    dueDate = dueDate + " " + time;
  } else addTime = false;
  dueDate = new Date(dueDate);

  let priority = Number(
    prompt("Choose priority level (0 - lowest, 3 - highest): ")
  );
  while (!checkChoice(priority, 0, 3)) {
    priority = Number(prompt("Please pick between one of the numbers!"));
  }
  const complete = false;
  const newTodo = new Todo(name, desc, dueDate, addTime, priority, complete);
  list.addTodo(newTodo);
  console.log("New to-do was added.");
}

function printDeleteTodo(list) {
  const todos = list.todos;
  if (todos.length > 0) {
    for (let i = 0; i < todos.length; i++) {
      console.log(`${i + 1}. ${todos[i]}`);
    }
    console.log(" ");
    let choice = Number(prompt("Select a todo to delete: "));
    while (!checkChoice(choice, 1, todos.length)) {
      choice = Number(prompt("Pick between one of the numbers!"));
    }
    list.deleteTodo(choice - 1);
    console.log("To-do has been removed.");
  } else {
    console.log("No to-dos to remove.");
  }
}

function editTodoName(todo) {
  const name = prompt("Name: ");
  todo.name = name;
  console.log("Changed the name.");
}
function editTodoDesc(todo) {
  const desc = prompt("Description: ");
  todo.desc = desc;
  console.log("Changed the description.");
}
function editTodoDueDate(todo) {
  let dueDate = prompt("Enter due date (YYYY/MM/DD)");
  let testDate = new Date(dueDate);
  while (!checkValidDate(testDate)) {
    dueDate = prompt("Please enter a valid date.");
    testDate = new Date(dueDate);
  }
  let addTime = prompt("Would you like to add a time? (y/n)");
  addTime = addTime.toLowerCase();
  while (addTime != "y" && addTime != "n") {
    addTime = prompt("Please choose 'y' or 'n'");
  }

  if (addTime == "y") {
    addTime = true;
    let time = prompt("Add a time in 24-hour format (HH:MM): ");
    let testTime = new Date(dueDate + " " + time);
    while (!checkValidDate(testTime)) {
      time = prompt("Please enter a valid time.");
      testTime = new Date(dueDate + " " + time);
    }
    dueDate = dueDate + " " + time;
  } else addTime = false;
  dueDate = new Date(dueDate);
  todo.dueDate = dueDate;
  console.log("Changed date/time.");
}

function editTodoPriority(todo) {
  let priority = Number(
    prompt("Choose priority level (0 - lowest, 3 - highest): ")
  );
  while (!checkChoice(priority, 0, 3)) {
    priority = Number(prompt("Please pick between one of the numbers!"));
  }
  todo.priority = priority;
  console.log("Changed to new priority.");
}

function editTodoComplete(todo) {
  todo.complete = !todo.complete;
  if (todo.complete) {
    console.log("Changed to complete");
  } else {
    console.log("Changed to incomplete");
  }
}

function checkChoice(choice, lowBound, highBound) {
  return choice >= lowBound && choice <= highBound && choice % 1 == 0;
}

function checkValidDate(date) {
  return date instanceof Date && !isNaN(date);
}
