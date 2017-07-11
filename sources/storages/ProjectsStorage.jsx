/* eslint-disable no-param-reassign */

class ProjectsStorage {
  constructor() {
    this.projects = new Map();
    this.visible = [];
    this.hidden = [];
  }

  fillFromServerData(items) {
    this.projects = new Map();
    this.visible = [];
    this.hidden = [];

    items.forEach((serverData) => {
      const project = {};

      project.id = serverData.id;
      project.name = serverData.name;
      project.visible = true;
      project.visibleChildrenIds = [];

      project.customSort = false;
      project.parentCustomSort = false;

      const parentData = serverData.parentProject;
      if (parentData) {
        const parent = this.projects.get(parentData.id);
        project.depth = parent.depth + 1;
        project.parentId = parent.id;
        project.visibleParentId = parent.id;

        parent.visibleChildrenIds.push(project.id);
      } else {
        project.depth = 0;
        this.rootId = project.id;
      }

      project.original = {
        name: project.name,
        depth: project.depth,
      };

      this.projects.set(serverData.id, project);
      this.pushProjectToVisible(project);
    });
  }

  saveState() {

  }

  refreshToSavedState() {

  }

  showItems(ids) {

  }

  hideItems(ids) {
    const hideInfo = {};

    this.projects.forEach((project) => {
      const parentHideInfo = hideInfo[project.visibleParentId];

      if (project.visible && ids.length) {
        const idsIndex = ids.indexOf(project.id);
        if (idsIndex !== -1) {
          ids.splice(idsIndex, 1);

          if (project.visibleParentId) {
            project.visible = false;

            if (parentHideInfo) {
              hideInfo[project.id] = {
                inParentFromEndIndex: parentHideInfo.inParentFromEndIndex,
              };
            } else {
              const visibleParent = this.projects.get(project.visibleParentId);
              const index = visibleParent.visibleChildrenIds.indexOf(project.id);
              if (index !== -1) {
                visibleParent.visibleChildrenIds.splice(index, 1);
                hideInfo[project.id] = {
                  inParentFromEndIndex: index - visibleParent.visibleChildrenIds.length,
                };
              }
            }
          }
        }
      }

      if (project.parentId) {
        const parent = this.projects.get(project.parentId);
        if (parent.visible) {
          project.name = project.original.name;
          project.depth = parent.depth + 1;
          project.visibleParentId = parent.id;
          project.parentCustomSort = parent.customSort;
        } else {
          project.name = `${parent.name} :: ${project.original.name}`;
          project.depth = parent.depth;
          project.visibleParentId = parent.visibleParentId;
          project.parentCustomSort = parent.parentCustomSort;

          if (project.visible && parentHideInfo) {
            // copy project id to new visible parent
            const newVisibleParent = this.projects.get(project.visibleParentId);
            const fromEndIndex = parentHideInfo.inParentFromEndIndex;
            newVisibleParent.visibleChildrenIds.splice(fromEndIndex, 0, project.id);
          }
        }
      }
    });

    this.refreshVisible();
  }

  sortDownVisible(ids) {
  }

  sortUpVisible(ids) {
  }

  filterHidden(value) {

  }

  clearFilter() {

  }

  refreshVisible() {
    const root = this.projects.get(this.rootId);
    this.visible = [];
    this.pushProjectToVisible(root);
    this.pushChildrenProjectsToVisible(root.visibleChildrenIds);
  }

  pushChildrenProjectsToVisible(projectsIds) {
    projectsIds.forEach((projectId) => {
      const project = this.projects.get(projectId);
      this.pushProjectToVisible(project);

      if (project.visibleChildrenIds.length) {
        this.pushChildrenProjectsToVisible(project.visibleChildrenIds);
      }
    });
  }

  pushProjectToVisible(project) {
    this.visible.push({
      id: project.id,
      name: project.name,
      depth: project.depth,
      parentCustomSort: project.parentCustomSort,
      parentId: project.visibleParentId,
    });
  }

  getVisible() {
    return this.visible;
  }

  getHidden() {
    return this.hidden;
  }
}

export default ProjectsStorage;
