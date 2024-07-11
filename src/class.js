export class Todo {
  constructor(name, desc = "", dueDate, priority, complete, tags = []) {
    this.name = name;
    this.desc = desc;
    this.dueDate = dueDate;
    this.priority = priority;
    this.complete = complete;
    this.tags = tags;
  }
  get name() {
    return this._name;
  }
  set name(name) {
    this._name = name;
  }
  get desc() {
    return this._desc;
  }
  set desc(desc) {
    this._desc = desc;
  }
  get dueDate() {
    return this._dueDate;
  }
  set dueDate(date) {
    this._dueDate = date;
  }
  get priority() {
    return this._priority;
  }
  set priority(priority) {
    this._priority = priority;
  }
  get complete() {
    return this._complete;
  }
  set complete(complete) {
    this._complete = complete;
  }

  toString() {
    return `${this.name} ${this.date}`;
  }
  printDetailed() {
    return `${this.name} ${this.date}\n${this.desc}\nComplete: ${this.complete}`;
  }
}

export class List {
  constructor(name, todos = []) {
    this.name = name;
    this.todos = todos;
  }
  get name() {
    return this._name;
  }
  set name(name) {
    this._name = name;
  }
  get todos() {
    return this._todos;
  }
  set todos(todos) {
    this._todos = todos;
  }
  addTodo(todo) {
    this._todos.push(todo);
  }
  removeTodo(index) {
    this._todos.splice(index, 1);
  }
}
