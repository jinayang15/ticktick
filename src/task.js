import * as App from "./app";

export default class Task {
  constructor(
    idx,
    name,
    desc = "",
    dueDate,
    useTime = false,
    priority,
    complete,
    listParent
  ) {
    this.idx = idx;
    this.name = name;
    this.desc = desc;
    this.dueDate = dueDate;
    this.useTime = useTime; // bool indicating whether to include datetime
    this.priority = priority;
    this.complete = complete;
    this.listParent = listParent;
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
  get useTime() {
    return this._useTime;
  }
  set useTime(bool) {
    this._useTime = bool;
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
  get listParent() {
    return this._listParent;
  }
  set listParent(listParent) {
    this._listParent = listParent;
  }
  toString() {
    return `${this.name} ${this.dueDate.toDateString()}`;
  }
  printDetailed() {
    let output = `${this.name} ${this.dueDate.toDateString()} `;
    if (this.useTime) {
      output += this.dueDate.toTimeString();
    }
    output += `\n${this.desc}\nPriority: ${this.priority}\nComplete: ${this.complete}`;
    return output;
  }
}
