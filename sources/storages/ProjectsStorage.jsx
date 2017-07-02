/* eslint-disable no-param-reassign */

import {
  generateKey,
  regenerateKeyFromParent,
} from '../utils/keyUtils';

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

    items.forEach((projectData) => {
      const project = {};
      project.id = projectData.id;
      project.name = projectData.name;
      project.visible = true;
      project.visibleChildrenCount = 0;
      project.isAnyChildHidden = false;
      project.customSort = false;
      project.parentCustomSort = false;

      project.filterMatch = false;
      project.filterTreeMatch = false;

      let sortNumber;
      const parentData = projectData.parentProject;
      if (parentData) {
        const parent = this.projects.get(parentData.id);
        project.depth = parent.depth + 1;
        project.parentId = parent.id;
        project.visibleParentId = project.parentId;

        sortNumber = parent.visibleChildrenCount;
        project.sortNumber = sortNumber;
        project.sortKey = generateKey(sortNumber, parent.sortKey);

        parent.visibleChildrenCount += 1;
      } else {
        project.depth = 0;
        project.sortKey = generateKey(0);
        this.rootId = project.id;
      }

      project.original = {
        name: project.name,
        depth: project.depth,
        sortKey: project.sortKey,
        sortNumber: project.sortNumber,
      };

      project.saved = {
        visible: true,
        name: project.name,
        customSort: false,
        parentCustomSort: false,
        sortKey: project.sortKey,
        depth: project.depth,
        visibleChildrenCount: project.depth,
        visibleParentId: project.visibleParentId,
      };

      this.projects.set(projectData.id, project);
      this.visible.push(project);
    });
  }

  saveState() {
    this.projects.forEach((project) => {
      project.saved = {
        visible: project.visible,
        name: project.name,
        customSort: project.customSort,
        parentCustomSort: project.parentCustomSort,
        sortKey: project.sortKey,
        depth: project.depth,
        visibleChildrenCount: project.visibleChildrenCount,
        visibleParentId: project.visibleParentId,
      };

      project.filterMatch = false;
      project.filterTreeMatch = false;
    });
  }

  refreshToSavedState() {
    this.visible = [];
    this.hidden = [];

    this.projects.forEach((project) => {
      Object.assign(project, project.saved);

      project.filterMatch = false;
      project.filterTreeMatch = false;

      if (project.visible) {
        this.visible.push(project);
      } else {
        this.hidden.push(project);
      }

      project.isAnyChildHidden = false;
    });

    this.refreshVisibleSort();
    this.refreshHiddenSort();
    this.refreshHidden();
  }

  showItems(ids) {
    this.toggleVisibility(true, ids);
  }

  hideItems(ids) {
    this.toggleVisibility(false, ids);
  }

  toggleVisibility(visible, ids) {
    const removeFromVisible = [];

    this.projects.forEach((project) => {
      project.isAnyChildHidden = false;

      if (!project.parentId) {
        return;
      }

      const parent = this.projects.get(project.parentId);

      let needMove = false;

      const idsIndex = ids.indexOf(project.id);
      if (ids.length && idsIndex !== -1) {
        project.visible = visible;
        project.filterMatch = false;
        project.filterTreeMatch = false;

        ids.splice(idsIndex, 1);

        needMove = true;
      }

      if (parent) {
        if (parent.visible) {
          project.name = project.original.name;
          project.depth = parent.depth + 1;
          project.visibleParentId = parent.id;
          project.parentCustomSort = parent.customSort;

          if (!parent.customSort && project.visible) {
            project.sortKey = generateKey(project.original.sortNumber, parent.sortKey);
          }
        } else {
          project.name = `${parent.name} :: ${project.original.name}`;
          project.depth = parent.depth;
          project.visibleParentId = parent.visibleParentId;
          project.parentCustomSort = parent.parentCustomSort;
        }
      }

      if (needMove && project.parentCustomSort && project.visible) {
        const visibleParent = this.projects.get(project.visibleParentId);
        if (visibleParent) {
          const level = visibleParent.visibleChildrenCount;
          project.sortKey = generateKey(level, visibleParent && visibleParent.sortKey);

          visibleParent.visibleChildrenCount += 1;
        }
      }

      if (needMove) {
        if (project.visible) {
          this.visible.push(project);
          if (parent) {
            parent.visibleChildrenCount += 1;
          }
        } else {
          removeFromVisible.push(project.id);
        }
      }
    });

    if (removeFromVisible.length) {
      this.visible = this.visible.filter(project => removeFromVisible.indexOf(project.id) === -1);
    }

    this.refreshHidden();
    this.recalculateVisibleSortKeys();
    this.refreshVisibleSort();
  }

  refreshHidden() {
    this.hidden = [];
    [...this.projects.values()].reverse().forEach((project) => {
      if (project.parentId && (!project.visible || project.isAnyChildHidden)) {
        this.hidden.unshift(project);

        const parent = this.projects.get(project.parentId);
        parent.isAnyChildHidden = true;
      }
    });
  }

  sortDownVisible(ids) {
    let needRefreshSort = false;

    const getNextSameLevelProject = (depth, nextIndex) => {
      const nextProject = this.visible[nextIndex];
      if (!nextProject || nextProject.depth === depth) {
        return { nextProject, nextIndex };
      }

      if (nextProject.depth > depth) {
        return getNextSameLevelProject(depth, nextIndex + 1);
      }

      return { nextProject: null, nextIndex };
    };

    for (let i = this.visible.length - 1; i > -1; i -= 1) {
      if (!ids.length) {
        break;
      }

      const project = this.visible[i];
      if (ids[ids.length - 1] === project.id) {
        ids.pop();

        const { nextProject, nextIndex } = getNextSameLevelProject(project.depth, i + 1);
        if (nextProject) {
          this.swapWithPreviousVisibleProject(nextProject, nextIndex - 1);

          if (project.id !== this.visible[i].id) {
            project.sorted = true;

            if (!needRefreshSort) {
              needRefreshSort = true;
            }
          }
        }
      }
    }

    if (needRefreshSort) {
      this.recalculateVisibleSortKeys();
      this.refreshVisibleSort();
    }

    return needRefreshSort;
  }

  swapWithPreviousVisibleProject = (project, prevIndex) => {
    const prevProject = prevIndex > -1 ? this.visible[prevIndex] : null;
    if (!prevProject || !project || prevProject.depth < project.depth
      || (prevProject.sorted && prevProject.depth === project.depth)) {
      return;
    }

    this.visible[prevIndex + 1] = prevProject;
    this.visible[prevIndex] = project;

    const parent = this.projects.get(project.visibleParentId);
    if (parent) {
      parent.customSort = true;
    }

    if (prevProject.depth > project.depth) {
      this.swapWithPreviousVisibleProject(project, prevIndex - 1);
    }
  };

  sortUpVisible(ids) {
    let needRefreshSort = false;

    for (let i = 0; i < this.visible.length; i += 1) {
      if (!ids.length) {
        break;
      }

      const project = this.visible[i];
      if (ids[0] === project.id) {
        ids.shift();
        this.swapWithPreviousVisibleProject(project, i - 1);

        if (project.id !== this.visible[i].id) {
          project.sorted = true;

          if (!needRefreshSort) {
            needRefreshSort = true;
          }
        }
      }
    }

    if (needRefreshSort) {
      this.recalculateVisibleSortKeys();
      this.refreshVisibleSort();
    }

    return needRefreshSort;
  }

  recalculateVisibleSortKeys() {
    this.visible.forEach((project) => {
      project.sorted = false;
      project.visibleChildrenCount = 0;

      if (project.visibleParentId) {
        const parent = this.projects.get(project.visibleParentId);
        project.parentCustomSort = parent.customSort;

        if (project.parentCustomSort) {
          project.sortKey = generateKey(parent.visibleChildrenCount, parent.sortKey);
        } else {
          project.sortKey = regenerateKeyFromParent(project.sortKey, parent.sortKey);
        }

        parent.visibleChildrenCount += 1;
      }
    });
  }

  refreshVisibleSort() {
    this.visible.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }

  refreshHiddenSort() {
    this.hidden.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }

  filterHidden(value) {
    const words = value ? value.trim().split(' ') : [];

    if (!words.length) {
      this.clearFilter();
      return;
    }

    const matches = {};
    matches[this.rootId] = {
      wordMatches: 0,
      withParentMatches: 0,
    };

    const setAllParentsFilterMatch = (parentId) => {
      if (parentId) {
        const parent = this.projects.get(parentId);
        if (parent) {
          let scanParents = false;

          if (matches[parent.id].wordMatches) {
            if (!parent.filterMatch) {
              parent.filterMatch = true;
              scanParents = true;
            }
          } else if (!parent.filterTreeMatch) {
            parent.filterTreeMatch = true;
            scanParents = true;
          }

          if (scanParents) {
            setAllParentsFilterMatch(parent.parentId);
          }
        }
      }
    };

    this.hidden.forEach((project) => {
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
          setAllParentsFilterMatch(project.parentId);
        } else if (matches[project.id].withParentMatches) {
          project.filterTreeMatch = true;
        }
      } else {
        project.filterMatch = false;
        project.filterTreeMatch = false;
      }
    });
  }

  clearFilter() {
    this.hidden.forEach((project) => {
      project.filterMatch = false;
      project.filterTreeMatch = false;
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
