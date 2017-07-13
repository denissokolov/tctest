/* eslint-disable no-param-reassign */

function setItemSelectedInfo(selectedInfo, { id, selected, isAnyChildSelected }) {
  let info = selectedInfo[id];
  if (!info) {
    info = {};
    selectedInfo[id] = info;
  }

  if (selected !== undefined) {
    info.selected = selected;
  }

  if (isAnyChildSelected !== undefined) {
    info.isAnyChildSelected = isAnyChildSelected;
  }
}

function setSelectedInfoFromOptions(selectedInfo, options) {
  for (let i = 0; i < options.length; i += 1) {
    if (options[i].selected) {
      setItemSelectedInfo(selectedInfo, { id: options[i].value, selected: true });
    }
  }
}

function setIsAnyChildSelected(selectedInfo, items) {
  let item;
  for (let i = items.length - 1; i > -1; i -= 1) {
    item = items[i];

    const info = selectedInfo[item.id];

    if (info && (info.selected || info.isAnyChildSelected)) {
      setItemSelectedInfo(selectedInfo, { id: item.parentId, isAnyChildSelected: true });
    }
  }
}

function getSelectedIdsFromSelectedInfo(selectedInfo, items) {
  const selectedIds = [];

  let id;
  items.forEach((item) => {
    id = item.id;

    const info = selectedInfo[id];
    if (info && info.selected) {
      selectedIds.push(id);
    } else {
      const parentInfo = selectedInfo[item.parentId];
      if (parentInfo && parentInfo.selected && !parentInfo.isAnyChildSelected) {
        selectedIds.push(item.id);
        setItemSelectedInfo(selectedInfo, { id, selected: true });
      }
    }
  });

  return selectedIds;
}

export function getSelectedIdsWithChildren(options, items) {
  const selectedInfo = {};

  setSelectedInfoFromOptions(selectedInfo, options);
  setIsAnyChildSelected(selectedInfo, items);
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
