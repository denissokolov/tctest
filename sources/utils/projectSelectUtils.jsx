/* eslint-disable no-param-reassign */

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
  let lastSelectedIndex = selectedIds.length - 1;
  let lastSelectedId = selectedIds[lastSelectedIndex];

  for (let i = items.length - 1; i > -1; i -= 1) {
    item = items[i];

    if (item.id === lastSelectedId) {
      lastSelectedIndex -= 1;
      lastSelectedId = lastSelectedIndex > -1 ? selectedIds[lastSelectedIndex] : null;

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

  return selectedIds;
}

export function getSelectedIdsWithChildren(selectedIds, items) {
  const selectedInfo = fillSelectedInfo(selectedIds, items);
  return getSelectedIdsFromSelectedInfo(selectedInfo, items);
}

export function getSelectedIds(options) {
  const selectedIds = [];

  for (let i = 0; i < options.length; i += 1) {
    if (options[i].selected) {
      selectedIds.push(options[i].value);
    }
  }

  return selectedIds;
}
