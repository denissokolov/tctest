/* eslint-disable no-param-reassign */

import { generateKey, getParentKeyFromKey } from '../utils/keyUtils';

class ProjectsStorage {
  constructor(items) {
    this.map = new Map();
    this.visible = [];
    this.hidden = [];

    const projectsInfo = {};
    const rootsCount = 0;

    items.forEach((project) => {
      const formattedProject = {};
      formattedProject.id = project.id;
      formattedProject.name = project.name;
      formattedProject.originalName = project.name;
      formattedProject.visible = true;

      const parent = project.parentProject;
      if (parent) {
        const parentInfo = projectsInfo[parent.id];
        formattedProject.depth = parentInfo.depth + 1;
        formattedProject.originalDepth = parentInfo.depth + 1;
        formattedProject.key = generateKey(parentInfo.childrenCount, parentInfo.key);

        parentInfo.childrenCount += 1;
      } else {
        formattedProject.depth = 0;
        formattedProject.originalDepth = 0;
        formattedProject.key = generateKey(rootsCount);
      }

      projectsInfo[project.id] = {
        depth: formattedProject.depth,
        key: formattedProject.key,
        childrenCount: 0,
      };

      this.map.set(formattedProject.key, formattedProject);
      this.visible.push(formattedProject);
    });
  }

  hideItems(keys) {
    const selectedInfo = {};

    keys.forEach((key) => {
      const info = selectedInfo[key];
      if (info) {
        info.selected = true;
      } else {
        selectedInfo[key] = {
          selected: true,
          isAnyChildSelected: false,
        };
      }

      const parentKey = getParentKeyFromKey(key);
      const parentInfo = selectedInfo[parentKey];
      if (parentInfo) {
        parentInfo.isAnyChildSelected = true;
      }
    });

    this.visible = [];
    this.map.forEach((project) => {
      const parentKey = getParentKeyFromKey(project.key);
      const parentInfo = selectedInfo[parentKey];
      const info = selectedInfo[project.key];

      if (info && info.selected) {
        project.visible = false;
      } else if (parentInfo && parentInfo.selected && !parentInfo.isAnyChildSelected) {
        project.visible = false;

        if (info) {
          info.selected = true;
        } else {
          selectedInfo[project.key] = {
            selected: true,
            isAnyChildSelected: false,
          };
        }
      }

      const parent = this.map.get(parentKey);
      if (parent) {
        if (parent.visible) {
          project.depth = parent.depth + 1;
        } else {
          project.name = `${parent.name} :: ${project.originalName}`;
          project.depth = parent.depth;
        }
      }

      if (project.visible) {
        this.visible.push(project);
      }
    });

    this.hidden = [];
    [...this.map.values()].reverse().forEach((project) => {
      if (!project.visible || project.isAnyChildHidden) {
        this.hidden.unshift(project);

        const parentKey = getParentKeyFromKey(project.key);
        if (parentKey) {
          const parent = this.map.get(parentKey);
          parent.isAnyChildHidden = true;
        }
      }
    });
  }

  showItems(keys) {

  }

  getVisible() {
    return this.visible;
  }

  getHidden() {
    return this.hidden;
  }
}

export default ProjectsStorage;
