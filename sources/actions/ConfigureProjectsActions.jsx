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

export function hideProjects(keys) {
  projectsStorage.hideItems(keys);

  return {
    type: 'HIDE_PROJECTS',
    visible: projectsStorage.getVisible(),
    hidden: projectsStorage.getHidden(),
  };
}

export function showProjects(keys) {
  projectsStorage.showItems(keys);

  return {
    type: 'SHOW_PROJECTS',
    visible: projectsStorage.getVisible(),
    hidden: projectsStorage.getHidden(),
  };
}
