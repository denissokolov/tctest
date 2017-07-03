import { generateKey } from '../utils/keyUtils';

export function getProjectPropsFromServerData(serverData) {
  const project = {};

  project.id = serverData.id;
  project.name = serverData.name;
  project.visible = true;
  project.visibleChildrenCount = 0;
  project.isAnyChildHidden = false;
  project.customSort = false;
  project.parentCustomSort = false;

  project.filterMatch = false;
  project.filterTreeMatch = false;

  return project;
}

export function getProjectPropsFromParent(parent) {
  const project = {};

  project.depth = parent.depth + 1;
  project.parentId = parent.id;
  project.visibleParentId = project.parentId;

  const sortNumber = parent.visibleChildrenCount;
  project.sortNumber = sortNumber;
  project.sortKey = generateKey(sortNumber, parent.sortKey);

  return project;
}

export function getProjectOriginalProps(project) {
  return {
    name: project.name,
    depth: project.depth,
    sortKey: project.sortKey,
    sortNumber: project.sortNumber,
  };
}

export function getProjectSavedProps(project) {
  return {
    visible: project.visible,
    name: project.name,
    customSort: project.customSort,
    parentCustomSort: project.parentCustomSort,
    sortKey: project.sortKey,
    depth: project.depth,
    visibleChildrenCount: project.visibleChildrenCount,
    visibleParentId: project.visibleParentId,
  };
}

export function getUpdatedProjectProps(project, parent) {
  const updatedProject = {};

  if (parent) {
    if (parent.visible) {
      updatedProject.name = project.original.name;
      updatedProject.depth = parent.depth + 1;
      updatedProject.visibleParentId = parent.id;
      updatedProject.parentCustomSort = parent.customSort;

      if (!parent.customSort && project.visible) {
        updatedProject.sortKey = generateKey(project.original.sortNumber, parent.sortKey);
      }
    } else {
      updatedProject.name = `${parent.name} :: ${project.original.name}`;
      updatedProject.depth = parent.depth;
      updatedProject.visibleParentId = parent.visibleParentId;
      updatedProject.parentCustomSort = parent.parentCustomSort;
    }
  }

  return updatedProject;
}
