import { Task, List } from "./class";

const _defaultLists = [
  new List("Today"),
  new List("Next 7 Days"),
  new List("All Tasks"),
];
const _userLists = [];

export function getLists() {
  return _userLists;
}
export function addList(...lists) {
  for (const list of lists) {
    _userLists.push(list);
  }
}
export function deleteList(index) {
  _userLists.splice(index, 1);
}
