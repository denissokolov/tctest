// TODO: tests, refactoring

export function getSelectedIdsWithChildren(options, items) {
  const reversedOptions = [...options].reverse();
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

  items.reverse().forEach((item, index) => {
    const id = item.get('id');
    const selected = reversedOptions[index].selected;
    setSelectedInfo({ id, selected });

    if (selected || selectedInfo[id].isAnyChildSelected) {
      setSelectedInfo({ id: item.get('parentId'), isAnyChildSelected: true });
    }
  });

  const selectedIds = [];
  items.forEach((item) => {
    const id = item.get('id');

    const info = selectedInfo[id];
    if (info && info.selected) {
      selectedIds.push(id);
    } else {
      const parentInfo = selectedInfo[item.get('parentId')];
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
