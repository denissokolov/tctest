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
    ids.reverse().forEach((id) => {
      const project = this.projects.get(id);
      const nextKey = getNextKeyOnSameLevel(project.sortKey);
      if (nextKey) {
        const nextProject = this.projects.get(this.sortKeys.get(nextKey));
        if (nextProject && !nextProject.sortered) {
          this.swapProjects(project, nextProject);
        } else {
          project.sortered = true;
        }
      } else {
        project.sortered = true;
      }
    });

    this.refreshSort();
  }

  sortUpVisible(ids) {
    ids.forEach((id) => {
      const project = this.projects.get(id);
      const prevKey = getPrevKeyOnSameLevel(project.sortKey);
      if (prevKey) {
        const prevProject = this.projects.get(this.sortKeys.get(prevKey));
        if (prevProject && !prevProject.sortered) {
          this.swapProjects(prevProject, project);
        } else {
          project.sortered = true;
        }
      } else {
        project.sortered = true;
      }
    });

    this.refreshSort();
  }

  swapProjects(prevProject, nextProject) {
    let parentSortKey;
    if (prevProject.parentId) {
      const parent = this.projects.get(prevProject.parentId);
      parentSortKey = parent.sortKey;
    }

    prevProject.levelSort += 1;
    prevProject.sortKey = generateKey(prevProject.levelSort, parentSortKey);
    this.sortKeys.set(prevProject.sortKey, prevProject.id);

    nextProject.levelSort -= 1;
    nextProject.sortKey = generateKey(nextProject.levelSort, parentSortKey);
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
