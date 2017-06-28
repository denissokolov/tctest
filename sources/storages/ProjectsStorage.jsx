/* eslint-disable no-param-reassign */

import {
  generateKey,
  swapFirstUncommonLevelsInKeys,
  getNextKeyOnSameLevel,
  getPrevKeyOnSameLevel,
  getOneThirdOfMaxLevelPosition,
  getTwoThirdOfMaxLevelPosition,
} from '../utils/keyUtils';

class ProjectsStorage {
  constructor(items) {
    this.projects = new Map();
    this.visible = [];
    this.hidden = [];

    this.rootsCustomSort = false;
    this.visibleRootsCount = 0;
    this.invisibleRootsCount = 0;

    items.forEach((projectData) => {
      const project = {};
      project.id = projectData.id;
      project.name = projectData.name;
      project.visible = true;
      project.visibleChildrenCount = 0;
      project.hiddenChildrenCount = 0;
      project.isAnyChildHidden = false;
      project.customSort = false;
      project.parentCustomSort = false;

      project.filterMatch = false;
      project.filterTreeMatch = false;

      const parentData = projectData.parentProject;
      if (parentData) {
        const parent = this.projects.get(parentData.id);
        project.depth = parent.depth + 1;
        project.parentId = parent.id;
        project.visibleParentId = project.parentId;

        project.sortKey = generateKey(parent.visibleChildrenCount, parent.sortKey);

        parent.visibleChildrenCount += 1;
      } else {
        project.depth = 0;
        project.sortKey = generateKey(this.visibleRootsCount);
        this.visibleRootsCount += 1;
      }

      project.original = {
        name: project.name,
        depth: project.depth,
        sortKey: project.sortKey,
      };

      // project.saved = {
      //   visible: true,
      //   customSort: false,
      //   parentCustomSort: false,
      // };

      this.savedRootsCustomSort = false;

      this.projects.set(projectData.id, project);
      this.visible.push(project);
    });
  }

  // saveState() {
  //   this.savedRootsCustomSort = this.rootsCustomSort;
  //
  //   this.projects.forEach((project) => {
  //     project.saved = {
  //       visible: project.visible,
  //       customSort: project.customSort,
  //       parentCustomSort: project.parentCustomSort,
  //       sortKey: project.sortKey,
  //       visibleChildrenCount: project.visibleChildrenCount,
  //     };
  //
  //     project.filterMatch = false;
  //     project.filterTreeMatch = false;
  //   });
  // }
  //
  // refreshToSavedState() {
  //   this.clearVisible();
  //   this.rootsCustomSort = this.savedRootsCustomSort;
  //
  //   this.projects.forEach((project) => {
  //     project.visible = project.saved.visible;
  //     project.customSort = project.saved.customSort;
  //     project.parentCustomSort = project.saved.parentCustomSort;
  //     project.sortKey = project.saved.sortKey;
  //     project.visibleChildrenCount = project.saved.visibleChildrenCount;
  //
  //     project.filterMatch = false;
  //     project.filterTreeMatch = false;
  //
  //     const parent = project.parentId ? this.projects.get(project.parentId) : null;
  //     this.refreshVisibleProject(project, parent);
  //   });
  //
  //   this.refreshHidden();
  //   this.refreshSort();
  // }

  showItems(ids) {
    this.toggleVisibility(true, ids);
  }

  hideItems(ids) {
    this.toggleVisibility(false, ids);
  }

  toggleVisibility(visible, ids) {
    const removeFromVisible = [];

    this.projects.forEach((project) => {
      const parent = project.parentId ? this.projects.get(project.parentId) : null;

      let needMove = false;

      if (ids.length && ids[0] === project.id) {
        project.visible = visible;
        project.filterMatch = false;
        project.filterTreeMatch = false;

        ids.shift();

        needMove = true;
      }

      if (parent) {
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
      }

      if (needMove && project.parentCustomSort && project.visible) {
        const visibleParent = this.projects.get(project.visibleParentId);
        if (visibleParent) {
          const level = visibleParent ? visibleParent.visibleChildrenCount : this.visibleRootsCount;
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

      project.isAnyChildHidden = false;
    });

    if (removeFromVisible.length) {
      this.visible = this.visible.filter(project => removeFromVisible.indexOf(project.id) === -1);
    }

    this.refreshHidden();
    this.recalculateVisibleSortKeys();
    this.refreshSort();
  }

  refreshHidden() {
    this.hidden = [];
    [...this.projects.values()].reverse().forEach((project) => {
      if (!project.visible || project.isAnyChildHidden) {
        this.hidden.unshift(project);

        if (project.parentId) {
          const parent = this.projects.get(project.parentId);
          parent.isAnyChildHidden = true;
        }
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

        if (nextProject && !nextProject.sorted) {
          const { key1, key2 } = swapFirstUncommonLevelsInKeys({
            key1: project.sortKey,
            key2: nextProject.sortKey,
          });

          this.visible[i] = nextProject;
          nextProject.sortKey = key2;

          this.visible[nextIndex] = project;
          project.sortKey = key1;

          const parent = this.projects.get(project.parentId);
          if (parent) {
            parent.customSort = true;
          } else {
            this.rootsCustomSort = true;
          }

          if (!needRefreshSort) {
            needRefreshSort = true;
          }
        }

        project.sorted = true;
      }
    }

    if (needRefreshSort) {
      this.recalculateVisibleSortKeys();
      this.refreshSort();
    }
  }

  sortUpVisible(ids) {
    let needRefreshSort = false;

    const swapWithPreviousProject = (project, prevIndex) => {
      const prevProject = prevIndex > -1 ? this.visible[prevIndex] : null;
      if (!prevProject || (prevProject.sorted && prevProject.depth === project.depth)) {
        return;
      }

      const { key1, key2 } = swapFirstUncommonLevelsInKeys({
        key1: project.sortKey,
        key2: prevProject.sortKey,
      });

      this.visible[prevIndex + 1] = prevProject;
      prevProject.sortKey = key2;

      this.visible[prevIndex] = project;
      project.sortKey = key1;

      const parent = this.projects.get(project.parentId);
      if (parent) {
        parent.customSort = true;
      } else {
        this.rootsCustomSort = true;
      }

      if (!needRefreshSort) {
        needRefreshSort = true;
      }

      if (prevProject.depth > project.depth) {
        swapWithPreviousProject(project, prevIndex - 1);
      }
    };

    for (let i = 0; i < this.visible.length; i += 1) {
      if (!ids.length) {
        break;
      }

      const project = this.visible[i];
      if (ids[0] === project.id) {
        ids.shift();
        swapWithPreviousProject(project, i - 1);
        project.sorted = true;
      }
    }

    if (needRefreshSort) {
      this.recalculateVisibleSortKeys();
      this.refreshSort();
    }
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
          const { key1 } = swapFirstUncommonLevelsInKeys({
            key1: project.sortKey,
            key2: parent.sortKey,
          });

          project.sortKey = key1;
        }

        parent.visibleChildrenCount += 1;
      }
    });
  }

  refreshSort() {
    this.visible.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }

  filterHidden(value) {
    const words = value ? value.trim().split(' ') : [];

    if (!words.length) {
      this.clearFilter();
      return;
    }

    const matches = {};

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
