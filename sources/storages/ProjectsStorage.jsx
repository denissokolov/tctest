/* eslint-disable no-param-reassign */

import {
  getProjectPropsFromServerData, getProjectOriginalProps, getProjectSavedProps,
  getProjectPropsFromParent,
} from '../utils/projectFormatter';

class ProjectsStorage {
  constructor() {
    this.projects = new Map();
    this.visible = [];
    this.hidden = [];
    this.hiddenFilteredIds = null;
    this.hiddenIds = [];
  }

  fillFromServerData(items) {
    this.projects = new Map();
    this.reversedProjectIds = [];

    this.visible = [];
    this.hidden = [];

    items.forEach((serverData) => {
      const project = getProjectPropsFromServerData(serverData);

      const parentData = serverData.parentProject;
      if (parentData) {
        const parent = this.projects.get(parentData.id);
        Object.assign(project, getProjectPropsFromParent(parent));
        parent.visibleChildrenIds.push(project.id);
        parent.saved.visibleChildrenIds.push(project.id);
      } else {
        project.depth = 0;
        this.rootId = project.id;
      }

      project.original = getProjectOriginalProps(project);
      project.saved = getProjectSavedProps(project);

      this.projects.set(project.id, project);
      this.reversedProjectIds.unshift(project.id);
      this.pushProjectToVisible(project);
    });
  }

  saveState() {
    this.projects.forEach((project) => {
      project.saved = getProjectSavedProps(project);

      project.filterMatch = false;
      project.filterTreeMatch = false;
    });
  }

  refreshToSavedState() {
    this.projects.forEach((project) => {
      Object.assign(project, project.saved);
      project.saved.visibleChildrenIds = [...project.saved.visibleChildrenIds];

      project.filterMatch = false;
      project.filterTreeMatch = false;
      project.isAnyChildHidden = false;
    });

    this.refreshVisible();
    this.refreshHidden();
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

      if (!project.visible && ids.has(project.id)) {
        project.visible = true;
        project.filterMatch = false;
        project.filterTreeMatch = false;

        addToVisibleParent = true;
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

      if (project.visible && ids.has(project.id) && project.visibleParentId) {
        project.visible = false;
        project.visibleChildrenIds = [];
        project.customSort = false;

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
    const sortedIds = this.getVisible().reduceRight((idsArray, shortProject) => {
      if (ids.has(shortProject.id)) {
        idsArray.push(shortProject.id);
      }
      return idsArray;
    }, []);
    return this.changeSort(sortedIds, true);
  }

  sortUpVisible(ids) {
    const sortedIds = this.getVisible().reduce((idsArray, shortProject) => {
      if (ids.has(shortProject.id)) {
        idsArray.push(shortProject.id);
      }
      return idsArray;
    }, []);
    return this.changeSort(sortedIds, false);
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
    const trimmedValue = value.trim();
    const words = trimmedValue ? trimmedValue.split(' ') : [];

    if (!words.length) {
      this.clearFilter();
      return;
    }

    const matches = {};
    matches[this.rootId] = {
      wordMatches: 0,
      withParentMatches: 0,
    };

    this.hiddenFilteredIds = new Set();

    this.hiddenIds.forEach((id) => {
      const project = this.projects.get(id);
      if (!project.parentId) {
        return;
      }

      project.filterMatch = false;
      project.filterTreeMatch = false;

      matches[project.id] = {
        wordMatches: 0,
        withParentMatches: 0,
      };

      const parent = project.parentId ? this.projects.get(project.parentId) : null;

      words.forEach((word, index) => {
        if (project.original.name.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
          matches[project.id][`word_${index}`] = true;
          matches[project.id].wordMatches += 1;
          matches[project.id].withParentMatches += 1;
        } else if (parent && matches[parent.id][`word_${index}`]) {
          matches[project.id][`word_${index}`] = true;
          matches[project.id].withParentMatches += 1;
        }
      });

      if (matches[project.id].withParentMatches === words.length) {
        if (matches[project.id].wordMatches) {
          project.filterMatch = true;
          this.hiddenFilteredIds.add(project.id);
          this.setAllParentsFilterMatch(matches, project.parentId);
        } else if (matches[project.id].withParentMatches) {
          project.filterTreeMatch = true;
          this.hiddenFilteredIds.add(project.id);
        }
      } else {
        project.filterMatch = false;
        project.filterTreeMatch = false;
      }
    });

    this.hidden = [];
    this.projects.forEach((project) => {
      if (this.hiddenFilteredIds.has(project.id)) {
        this.hidden.push(this.convertHiddenProjectToShort(project));
      }
    });
  }

  setAllParentsFilterMatch(matches, parentId) {
    if (parentId) {
      const parent = this.projects.get(parentId);
      if (parent && parent.parentId) {
        let scanParents = false;

        if (matches[parent.id].wordMatches) {
          if (!parent.filterMatch) {
            parent.filterMatch = true;
            this.hiddenFilteredIds.add(parentId);
            scanParents = true;
          }
        } else if (!parent.filterTreeMatch) {
          parent.filterTreeMatch = true;
          this.hiddenFilteredIds.add(parent.id);
          scanParents = true;
        }

        if (scanParents) {
          this.setAllParentsFilterMatch(matches, parent.parentId);
        }
      }
    }
  }

  clearFilter() {
    this.hiddenFilteredIds = null;
    this.refreshHidden();
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
    this.hiddenIds = [];

    const filterActive = Boolean(this.hiddenFilteredIds);

    let project;
    let parent;
    this.reversedProjectIds.forEach((id) => {
      project = this.projects.get(id);

      if (project.parentId && (!project.visible || project.isAnyChildHidden)) {
        parent = this.projects.get(project.parentId);
        parent.isAnyChildHidden = true;

        this.hiddenIds.push(project.id);

        if (!filterActive) {
          project.filterMatch = false;
          project.filterTreeMatch = false;
        }

        if (!filterActive || this.hiddenFilteredIds.has(project.id)) {
          this.hidden.push(this.convertHiddenProjectToShort(project));
        }
      }
    });

    this.hidden.reverse();
    this.hiddenIds.reverse();
  }

  convertHiddenProjectToShort = project => ({
    id: project.id,
    name: project.original.name,
    depth: project.original.depth,
    parentId: project.parentId,
    disabled: project.visible,
    filterMatch: project.filterMatch,
  });

  getVisible() {
    return this.visible;
  }

  getHidden() {
    return this.hidden;
  }
}

export default ProjectsStorage;
