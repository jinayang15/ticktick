import List from "./list";
import { differenceInCalendarDays } from "date-fns";

const _todayList = new List(-4, "Today");
const _weekList = new List(-3, "Next 7 Days");
const _allList = new List(-2, "All Tasks");
const _completedList = new List(-1, "Completed");
const _autoLists = [_todayList, _weekList, _allList, _completedList];
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

export function getCompletedList() {
  return _completedList;
}

export function sortTasksIntoPresetLists() {
  // reset today, week, and all list
  _todayList.tasks = [];
  _weekList.tasks = [];
  _allList.tasks = [];
  _completedList.tasks = [];
  for (const list of _userLists) {
    _allList.tasks = _allList.tasks.concat(list.tasks);
  }
  _todayList.tasks = _allList.tasks.filter((task, idx, array) => {
    if (task.dueDate) {
      const diff = differenceInCalendarDays(task.dueDate, new Date());
      return diff <= 0;
    }
    return false;
  });
  _weekList.tasks = _allList.tasks.filter((task, idx, array) => {
    if (task.dueDate) {
      const diff = differenceInCalendarDays(task.dueDate, new Date());
      return diff <= 7;
    }
    return false;
  });
  _completedList.tasks = _allList.tasks.filter((task, idx, array) => {
    return task.complete == true;
  });
}
