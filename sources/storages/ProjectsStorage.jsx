/* eslint-disable no-param-reassign */

import { generateKey, getNextKeyOnSameLevel, getPrevKeyOnSameLevel } from '../utils/keyUtils';

class ProjectsStorage {
  constructor(items) {
    this.projects = new Map();
    this.sortKeys = new Map();
    this.visible = [];
    this.hidden = [];

    let rootsCount = 0;

    items.forEach((projectData) => {
      const project = {};
      project.id = projectData.id;
      project.name = projectData.name;
      project.originalName = projectData.name;
      project.visible = true;
      project.childrenCount = 0;

      const parentData = projectData.parentProject;
      if (parentData) {
        const parent = this.projects.get(parentData.id);
        project.depth = parent.depth + 1;
        project.originalDepth = project.depth;
        project.parentId = parent.id;

        project.levelSort = parent.childrenCount;

        project.sortKey = generateKey(project.levelSort, parent.sortKey);
        this.sortKeys.set(project.sortKey, project.id);

        parent.childrenCount += 1;
      } else {
        project.depth = 0;
        project.originalDepth = 0;
        project.levelSort = rootsCount;
        project.sortKey = generateKey(project.levelSort);
        rootsCount += 1;
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
    this.visible = [];
    this.projects.forEach((project) => {
      if (ids.length && ids[0] === project.id) {
        project.visible = visible;
        ids.shift();
      }

      if (project.parentId) {
        const parent = this.projects.get(project.parentId);
        if (parent.visible) {
          project.name = project.originalName;
          project.depth = parent.depth + 1;
        } else {
          project.name = `${parent.name} :: ${project.originalName}`;
          project.depth = parent.depth;
        }
      }

      if (project.visible) {
        this.visible.push(project);
      }

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
  }

  sortDownVisible(ids) {
    let needRefreshSort = false;

    ids.reverse().forEach((id) => {
      const project = this.projects.get(id);
      const nextProject = this.getNeighborVisibleProject(project.sortKey);
      if (nextProject && !nextProject.sortered) {
        this.swapProjects(project, nextProject);
        if (!needRefreshSort) {
          needRefreshSort = true;
        }
      } else {
        project.sortered = true;
      }
    });

    if (needRefreshSort) {
      this.refreshSort();
    }
  }

  sortUpVisible(ids) {
    let needRefreshSort = false;

    ids.forEach((id) => {
      const project = this.projects.get(id);
      const prevProject = this.getNeighborVisibleProject(project.sortKey, true);
      if (prevProject && !prevProject.sortered) {
        this.swapProjects(prevProject, project);
        if (!needRefreshSort) {
          needRefreshSort = true;
        }
      } else {
        project.sortered = true;
      }
    });

    if (needRefreshSort) {
      this.refreshSort();
    }
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
      project.sortered = false;

      let parentSortKey;
      if (project.parentId) {
        const parent = this.projects.get(project.parentId);
        parentSortKey = parent.sortKey;
      }

      project.sortKey = generateKey(project.levelSort, parentSortKey);
      this.sortKeys.set(project.sortKey, project.id);
    });

    const sort = (a, b) => a.sortKey.localeCompare(b.sortKey);

    this.visible.sort(sort);

    setTimeout(() => {
      this.projects = new Map([...this.projects.entries()]
        .sort((a, b) => a[1].sortKey.localeCompare(b[1].sortKey)));
      this.hidden.sort(sort); // TODO: custom logic for hidden
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
