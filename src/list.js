export default class List {
  constructor(idx, name, tasks = []) {
    this.idx = idx;
    this.name = name;
    this.tasks = tasks;
  }
  get idx() {
    return this._idx;
  }
  set idx(idx) {
    this._idx = idx;
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
  addTask(...tasks) {
    for (const task of tasks) {
      this._tasks.push(task);
    }
  }
  deleteTask(index) {
    this._tasks.splice(index, 1);
  }
}
