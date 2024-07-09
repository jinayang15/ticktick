export class Task {
  constructor(
    name,
    desc = "",
    startDate,
    endDate,
    time = 0,
    priority,
    complete,
    tags = []
  ) {
    this._name = name;
    this._desc = desc;
    this._startDate = startDate;
    this._endDate = endDate;
    this._time = time;
    this._priority = priority;
    this._complete = complete;
    this._tags = tags;
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
  get date() {
    return this._date;
  }
  set date(date) {
    this._date = date;
  }
  get time() {
    return this._time;
  }
  set time(time) {
    this._time = time;
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
}

export class List {
  constructor(name, todos = []) {
    this._name = name;
    this._todos = todos;
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
  addTodo(todo) {
    this._todos.push(todo);
  }
  removeTodo(index) {
    this._todos.splice(index, 1);
  }
}
