/* eslint-disable no-param-reassign */

import {
  generateKey,
  getNextKeyOnSameLevel,
  getPrevKeyOnSameLevel,
  getOneThirdOfMaxLevelPosition,
  getTwoThirdOfMaxLevelPosition,
} from '../utils/keyUtils';

class ProjectsStorage {
  constructor(items) {
    this.projects = new Map();
    this.sortKeys = new Map();
    this.visible = [];
    this.hidden = [];

    this.rootsCustomSort = false;
    this.visibleRootsCount = 0;
    this.invisibleRootsCount = 0;

    items.forEach((projectData) => {
      const project = {};
      project.id = projectData.id;
      project.name = projectData.name;
      project.originalName = projectData.name;
      project.visible = true;
      project.visibleChildrenCount = 0;
      project.invisibleChildrenCount = 0;
      project.customSort = false;
      project.parentCustomSort = false;

      const parentData = projectData.parentProject;
      if (parentData) {
        const parent = this.projects.get(parentData.id);
        project.depth = parent.depth + 1;
        project.originalDepth = project.depth;
        project.parentId = parent.id;

        project.levelSort = parent.visibleChildrenCount;

        project.sortKey = generateKey(project.levelSort, parent.sortKey);
        this.sortKeys.set(project.sortKey, project.id);

        parent.visibleChildrenCount += 1;
      } else {
        project.depth = 0;
        project.originalDepth = 0;
        project.levelSort = this.visibleRootsCount;
        project.sortKey = generateKey(project.levelSort);
        this.visibleRootsCount += 1;
      }

      this.projects.set(projectData.id, project);
      this.visible.push(project);
    });
  }

  showItems(ids) {
    this.toggleVisibility(true, ids);
  }

  hideItems(ids) {
    this.toggleVisibility(false, ids);
  }

  toggleVisibility(visible, ids) {
    let needRefreshSort = false;

    this.visible = [];
    this.visibleRootsCount = 0;
    this.invisibleRootsCount = 0;

    let selectedCount = 0;

    this.projects.forEach((project) => {
      const parent = project.parentId ? this.projects.get(project.parentId) : null;
      let selected = false;

      if (ids.length && ids[0] === project.id) {
        selected = true;
        project.visible = visible;
        ids.shift();

        if (!needRefreshSort && project.parentCustomSort) {
          needRefreshSort = true;
        }
      }

      if (parent) {
        if (parent.visible) {
          project.name = project.originalName;
          project.depth = parent.depth + 1;
        } else {
          project.name = `${parent.name} :: ${project.originalName}`;
          project.depth = parent.depth;

          // TODO: fix sort
        }
      }

      if (project.parentCustomSort) {
        if (project.visible) {
          project.levelSort = parent ? parent.visibleChildrenCount : this.visibleRootsCount;
        } else if (selected) {
          project.levelSort = getTwoThirdOfMaxLevelPosition() + selectedCount;
        } else {
          const number = parent ? parent.invisibleChildrenCount : this.invisibleRootsCount;
          project.levelSort = getOneThirdOfMaxLevelPosition() + number;
        }

        project.sortKey = generateKey(project.levelSort, parent && parent.sortKey);
        this.sortKeys.set(project.sortKey, project.id);
      }

      if (project.visible) {
        this.visible.push(project);

        if (parent) {
          parent.visibleChildrenCount += 1;
        } else {
          this.visibleRootsCount += 1;
        }
      } else if (parent) {
        parent.invisibleChildrenCount += 1;
      } else {
        this.invisibleRootsCount += 1;
      }

      if (selected) {
        selectedCount += 1;
      }

      project.visibleChildrenCount = 0;
      project.invisibleChildrenCount = 0;
      project.isAnyChildHidden = undefined;
    });

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

    if (needRefreshSort) {
      this.refreshSort();
    }
  }

  sortDownVisible(ids) {
    let needRefreshSort = false;

    ids.reverse().forEach((id) => {
      const project = this.projects.get(id);
      const nextProject = this.getNeighborVisibleProject(project.sortKey);
      if (nextProject && !nextProject.sorted) {
        this.swapProjects(project, nextProject);

        const parent = this.projects.get(project.parentId);
        if (parent) {
          parent.customSort = true;
        } else {
          this.rootsCustomSort = true;
        }

        if (!needRefreshSort) {
          needRefreshSort = true;
        }
      } else {
        project.sorted = true;
      }
    });

    if (needRefreshSort) {
      this.refreshSort();
    }

    return needRefreshSort;
  }

  sortUpVisible(ids) {
    let needRefreshSort = false;

    ids.forEach((id) => {
      const project = this.projects.get(id);
      const prevProject = this.getNeighborVisibleProject(project.sortKey, true);
      if (prevProject && !prevProject.sorted) {
        this.swapProjects(prevProject, project);

        const parent = this.projects.get(project.parentId);
        if (parent) {
          parent.customSort = true;
        } else {
          this.rootsCustomSort = true;
        }

        if (!needRefreshSort) {
          needRefreshSort = true;
        }
      } else {
        project.sorted = true;
      }
    });

    if (needRefreshSort) {
      this.refreshSort();
    }

    return needRefreshSort;
  }

  getNeighborVisibleProject(sortKey, needPrev) {
    const neighborKey = needPrev ? getPrevKeyOnSameLevel(sortKey) : getNextKeyOnSameLevel(sortKey);
    if (!neighborKey) {
      return null;
    }

    const neighborProject = this.projects.get(this.sortKeys.get(neighborKey));
    if (!neighborProject) {
      return null;
    }

    if (neighborProject.visible) {
      return neighborProject;
    }

    return this.getNeighborVisibleProject(neighborProject.sortKey, needPrev);
  }

  swapProjects(prevProject, nextProject) {
    const prevLevelSort = prevProject.levelSort;
    const prevSortKey = prevProject.sortKey;

    prevProject.levelSort = nextProject.levelSort;
    prevProject.sortKey = nextProject.sortKey;
    this.sortKeys.set(prevProject.sortKey, prevProject.id);

    nextProject.levelSort = prevLevelSort;
    nextProject.sortKey = prevSortKey;
    this.sortKeys.set(nextProject.sortKey, nextProject.id);
  }

  refreshSort() {
    this.sortKeys = new Map();
    this.projects.forEach((project) => {
      project.sorted = false;

      let parentSortKey;
      if (project.parentId) {
        const parent = this.projects.get(project.parentId);
        parentSortKey = parent.sortKey;
        project.parentCustomSort = parent.customSort;
      } else {
        project.parentCustomSort = this.rootsCustomSort;
      }

      project.sortKey = generateKey(project.levelSort, parentSortKey);
      this.sortKeys.set(project.sortKey, project.id);
    });

    this.visible.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    this.hidden.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    this.projects = new Map([...this.projects.entries()]
      .sort((a, b) => a[1].sortKey.localeCompare(b[1].sortKey)));
  }

  getVisible() {
    return this.visible;
  }

  getHidden() {
    return this.hidden;
  }
}

export default ProjectsStorage;
