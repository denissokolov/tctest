/* eslint-disable no-param-reassign */
import { Set } from 'immutable';

function setItemSelected(selectedInfo, id) {
  let info = selectedInfo[id];
  if (!info) {
    info = {};
    selectedInfo[id] = info;
  }

  info.selected = true;
}

function fillSelectedInfo(selectedIds, items) {
  const selectedInfo = {};

  let item;

  for (let i = items.length - 1; i > -1; i -= 1) {
    item = items[i];

    if (selectedIds.has(item.id)) {
      setItemSelected(selectedInfo, item.id);

      if (!selectedInfo[item.parentId]) {
        selectedInfo[item.parentId] = { isAnyChildSelected: true };
      }
    } else if (selectedInfo[item.id] && !selectedInfo[item.parentId]) {
      selectedInfo[item.parentId] = { isAnyChildSelected: true };
    }
  }

  return selectedInfo;
}

function getSelectedIdsFromSelectedInfo(selectedInfo, items) {
  const selectedIds = [];

  let id;
  let info;
  items.forEach((item) => {
    id = item.id;

    info = selectedInfo[id];
    if (info && info.selected) {
      selectedIds.push(id);
    } else {
      const parentInfo = selectedInfo[item.parentId];
      if (parentInfo && parentInfo.selected && !parentInfo.isAnyChildSelected) {
        selectedIds.push(item.id);
        setItemSelected(selectedInfo, id);
      }
    }
  });

  return new Set(selectedIds);
}

export function getSelectedIdsWithChildren(selectedIds, items) {
  const selectedInfo = fillSelectedInfo(selectedIds, items);
  return getSelectedIdsFromSelectedInfo(selectedInfo, items);
}
