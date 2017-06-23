/* eslint-disable no-param-reassign */

class ProjectsStorage {
  constructor(items) {
    this.map = new Map();
    this.visible = [];
    this.hidden = [];

    items.forEach((project) => {
      const formattedProject = {};
      formattedProject.id = project.id;
      formattedProject.name = project.name;
      formattedProject.originalName = project.name;
      formattedProject.visible = true;

      const parent = project.parentProject;
      if (parent) {
        const parentFormatted = this.map.get(parent.id);
        formattedProject.depth = parentFormatted.depth + 1;
        formattedProject.originalDepth = parentFormatted.depth + 1;
        formattedProject.parentId = project.parentProject.id;
      } else {
        formattedProject.depth = 0;
        formattedProject.originalDepth = 0;
      }

      this.map.set(project.id, formattedProject);
      this.visible.push(formattedProject);
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
    this.map.forEach((project) => {
      if (ids.length && ids[0] === project.id) {
        project.visible = visible;
        ids.shift();
      }

      if (project.parentId) {
        const parent = this.map.get(project.parentId);
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

        if (project.parentId) {
          const parent = this.map.get(project.parentId);
          parent.isAnyChildHidden = true;
        }
      }
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
