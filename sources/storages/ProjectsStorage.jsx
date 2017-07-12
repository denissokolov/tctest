/* eslint-disable no-param-reassign */

class ProjectsStorage {
  constructor() {
    this.projects = new Map();
    this.visible = [];
    this.hidden = [];
  }

  fillFromServerData(items) {
    this.projects = new Map();
    this.reversedProjectIds = [];

    this.visible = [];
    this.hidden = [];

    items.forEach((serverData) => {
      const project = {};

      project.id = serverData.id;
      project.name = serverData.name;
      project.visible = true;
      project.visibleChildrenIds = [];
      project.isAnyChildHidden = false;

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

      this.projects.set(project.id, project);
      this.reversedProjectIds.unshift(project.id);
      this.pushProjectToVisible(project);
    });
  }

  saveState() {

  }

  refreshToSavedState() {

  }

  showItems(ids) {
    this.projects.forEach((project) => {
      let addToVisibleParent = false;

      if (project.parentId) {
        const parent = this.projects.get(project.parentId);
        const oldVisibleParentId = project.visibleParentId;

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
        }

        if (project.visibleParentId !== oldVisibleParentId) {
          const oldVisibleParent = this.projects.get(oldVisibleParentId);
          const index = oldVisibleParent.visibleChildrenIds.indexOf(project.id);
          if (index !== -1) {
            oldVisibleParent.visibleChildrenIds.splice(index, 1);
            addToVisibleParent = true;
          }
        }
      }

      if (!project.visible && ids.length) {
        const idsIndex = ids.indexOf(project.id);
        if (idsIndex !== -1) {
          ids.splice(idsIndex, 1);
          project.visible = true;
          addToVisibleParent = true;
        }
      }

      if (project.visible) {
        if (project.visibleParentId && (!project.parentCustomSort || addToVisibleParent)) {
          const visibleParent = this.projects.get(project.visibleParentId);
          visibleParent.visibleChildrenIds.push(project.id);
        }

        if (!project.customSort) {
          project.visibleChildrenIds = [];
        }
      }

      project.isAnyChildHidden = false;
    });

    this.refreshVisible();
    this.refreshHidden();
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
            project.visibleChildrenIds = [];

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

      project.isAnyChildHidden = false;
    });

    this.refreshVisible();
    this.refreshHidden();
  }

  sortDownVisible(ids) {
    return this.changeSort(ids.reverse(), true);
  }

  sortUpVisible(ids) {
    return this.changeSort(ids, false);
  }

  changeSort(ids, downDirection) {
    const sortedIds = {};

    if (ids.length === 1 && ids[0] === this.rootId) {
      return false;
    }

    let needRefresh = false;
    ids.forEach((id) => {
      const project = this.projects.get(id);
      if (!project.visibleParentId) {
        return;
      }

      sortedIds[project.id] = true;

      const visibleParent = this.projects.get(project.visibleParentId);
      const projectInParentIndex = visibleParent.visibleChildrenIds.indexOf(project.id);

      if (projectInParentIndex === -1
        || (downDirection && projectInParentIndex === visibleParent.visibleChildrenIds.length - 1)
        || (!downDirection && projectInParentIndex === 0)) {
        return;
      }

      const targetProjectIndex = projectInParentIndex + (downDirection ? 1 : -1);
      const targetProjectId = visibleParent.visibleChildrenIds[targetProjectIndex];
      if (sortedIds[targetProjectId]) {
        return;
      }

      visibleParent.visibleChildrenIds[projectInParentIndex] = targetProjectId;
      visibleParent.visibleChildrenIds[targetProjectIndex] = project.id;
      needRefresh = true;

      if (!visibleParent.customSort) {
        visibleParent.customSort = true;
        visibleParent.visibleChildrenIds.forEach((childId) => {
          const child = this.projects.get(childId);
          child.parentCustomSort = true;
        });
      }
    });

    if (needRefresh) {
      this.refreshVisible();
    }
    return needRefresh;
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

  refreshHidden() {
    this.hidden = [];

    this.reversedProjectIds.forEach((id) => {
      const project = this.projects.get(id);
      if (project.parentId && (!project.visible || project.isAnyChildHidden)) {
        const parent = this.projects.get(project.parentId);
        parent.isAnyChildHidden = true;

        this.unshiftProjectHidden(project);
      }
    });
  }

  unshiftProjectHidden(project) {
    this.hidden.unshift({
      id: project.id,
      name: project.original.name,
      depth: project.original.depth,
      parentId: project.parentId,
      noInteractive: project.visible,
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
