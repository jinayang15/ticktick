const _lists = [];

export function getLists() {
  return _lists;
}
export function addList(list) {
  _lists.push(list);
}
export function deleteList(index) {
  _lists.splice(index, 1);
}
