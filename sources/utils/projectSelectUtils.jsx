// TODO: tests, refactoring

export function getSelectedIdsWithChildren(options, items, parentProp) {
  const selectedInfo = {};

  const setSelectedInfo = ({ id, selected, isAnyChildSelected }) => {
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
  };

  [...options].forEach((option) => {
    setSelectedInfo({ id: option.value, selected: option.selected });
  });

  items.reverse().forEach((item) => {
    const id = item.get('id');

    const info = selectedInfo[id];

    if (info && (info.selected || info.isAnyChildSelected)) {
      setSelectedInfo({ id: item.get(parentProp), isAnyChildSelected: true });
    }
  });

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
        setSelectedInfo({ id, selected: true });
      }
    }
  });

  return selectedIds;
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
