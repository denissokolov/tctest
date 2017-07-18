export function getProjectPropsFromServerData(serverData) {
  return {
    id: serverData.id,
    name: serverData.name,
    visible: true,
    visibleChildrenIds: [],
    isAnyChildHidden: false,
    customSort: false,
    parentCustomSort: false,
    filterMatch: false,
    filterTreeMatch: false,
  };
}

export function getProjectPropsFromParent(parent) {
  return {
    depth: parent.depth + 1,
    parentId: parent.id,
    visibleParentId: parent.id,
  };
}

export function getProjectOriginalProps(project) {
  return {
    name: project.name,
    depth: project.depth,
  };
}

export function getProjectSavedProps(project) {
  return {
    name: project.name,
    visible: project.visible,
    visibleChildrenIds: [...project.visibleChildrenIds],
    customSort: project.customSort,
    parentCustomSort: project.parentCustomSort,
    depth: project.depth,
    visibleParentId: project.visibleParentId,
  };
}
