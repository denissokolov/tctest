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
  [...options].forEach((option) => {
    setItemSelectedInfo(selectedInfo, { id: option.value, selected: option.selected });
  });
}

function setIsAnyChildSelected(selectedInfo, items, parentProp) {
  items.reverse().forEach((item) => {
    const id = item.get('id');

    const info = selectedInfo[id];

    if (info && (info.selected || info.isAnyChildSelected)) {
      setItemSelectedInfo(selectedInfo, { id: item.get(parentProp), isAnyChildSelected: true });
    }
  });
}

function getSelectedIdsFromSelectedInfo(selectedInfo, items, parentProp) {
  const selectedIds = [];

  items.forEach((item) => {
    const id = item.get('id');

    const info = selectedInfo[id];
    if (info && info.selected) {
      selectedIds.push(id);
    } else {
      const parentInfo = selectedInfo[item.get(parentProp)];
      if (parentInfo && parentInfo.selected && !parentInfo.isAnyChildSelected) {
        selectedIds.push(item.get('id'));
        setItemSelectedInfo(selectedInfo, { id, selected: true });
      }
    }
  });

  return selectedIds;
}

export function getSelectedIdsWithChildren(options, items, parentProp) {
  const selectedInfo = {};

  setSelectedInfoFromOptions(selectedInfo, options);
  setIsAnyChildSelected(selectedInfo, items, parentProp);
  return getSelectedIdsFromSelectedInfo(selectedInfo, items, parentProp);
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
