export class Task {
  constructor(
    name,
    desc = "",
    dueDate,
    time = false,
    priority,
    complete,
    tags = []
  ) {
    this.name = name;
    this.desc = desc;
    this.dueDate = dueDate;
    this.time = time;
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
  set dueDate(dueDate) {
    this._dueDate = dueDate;
  }
  get time() {
    return this._time;
  }
  set time(bool) {
    this._time = bool;
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
    return `${this.name} ${this.dueDate.toDateString()}`;
  }
  printDetailed() {
    let output = `${this.name} ${this.dueDate.toDateString()} `;
    if (this.time) {
      output += this.dueDate.toTimeString();
    }
    output += `\n${this.desc}\nPriority: ${this.priority}\nComplete: ${this.complete}`;
    return output;
  }
}

export class List {
  constructor(name, tasks = []) {
    this.name = name;
    this.tasks = tasks;
  }
  get name() {
    return this._name;
  }
  set name(name) {
    this._name = name;
  }
  get tasks() {
    return this._tasks;
  }
  set tasks(tasks) {
    this._tasks = tasks;
  }
  addTask(task) {
    this._tasks.push(task);
  }
  deleteTask(index) {
    this._tasks.splice(index, 1);
  }
}
