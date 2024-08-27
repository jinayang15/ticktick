import List from "./list";

const _todayList = new List(-3, "Today");
const _weekList = new List(-2, "Next 7 Days");
const _allList = new List(-1, "All Tasks");
const _autoLists = [_todayList, _weekList, _allList];
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

export function getAutoLists() {
  return _autoLists;
}

export function getTodayList() {
  return _todayList;
}

export function getWeekList() {
  return _weekList;
}

export function getAllList() {
  return _allList;
}

export function autoSortTasks() {
  // reset today and week list
  c
}
