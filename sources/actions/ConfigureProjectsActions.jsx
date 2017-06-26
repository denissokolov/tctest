/* global fetch */

import ProjectsStorage from '../storages/ProjectsStorage';

let projectsStorage;

export function loadProjects() {
  return (dispatch) => {
    dispatch({ type: 'LOAD_PROJECTS_PROGRESS' });

    // TODO: add polyfill
    fetch('data.json')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        projectsStorage = new ProjectsStorage(data.project);

        dispatch({
          type: 'LOAD_PROJECTS_SUCCESS',
          visible: projectsStorage.getVisible(),
          hidden: projectsStorage.getHidden(),
        });
      })
      .catch((error) => {
        dispatch({
          type: 'LOAD_PROJECTS_FAIL',
          error,
        });
      });
  };
}

export function hideProjects(ids) {
  projectsStorage.hideItems(ids);

  return {
    type: 'HIDE_PROJECTS',
    visible: projectsStorage.getVisible(),
    hidden: projectsStorage.getHidden(),
  };
}

export function showProjects(ids) {
  projectsStorage.showItems(ids);

  return {
    type: 'SHOW_PROJECTS',
    visible: projectsStorage.getVisible(),
    hidden: projectsStorage.getHidden(),
  };
}

export function moveProjectsUp(ids) {
  const sortChanged = projectsStorage.sortUpVisible(ids);

  return {
    type: 'MOVE_PROJECTS_UP',
    items: projectsStorage.getVisible(),
    sortChanged,
  };
}

export function moveProjectsDown(ids) {
  const sortChanged = projectsStorage.sortDownVisible(ids);

  return {
    type: 'MOVE_PROJECTS_DOWN',
    items: projectsStorage.getVisible(),
    sortChanged,
  };
}

export function changeHiddenFilter(value) {
  projectsStorage.filterHidden(value);

  return {
    type: 'CHANGE_HIDDEN_PROJECTS_FILTER',
    items: projectsStorage.getHidden(),
    value,
  };
}

export function saveProjectsConfiguration() {
  projectsStorage.saveState();

  return {
    type: 'SAVE_PROJECTS_CONFIGURATION',
  };
}

export function refreshProjectsConfiguration() {
  projectsStorage.refreshToSavedState();

  return {
    type: 'REFRESH_PROJECTS_CONFIGURATION',
    visible: projectsStorage.getVisible(),
    hidden: projectsStorage.getHidden(),
  };
}
