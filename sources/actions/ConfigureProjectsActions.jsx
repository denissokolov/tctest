/* globals fetch, PROJECTS_URL */

import 'whatwg-fetch';

export function loadProjects() {
  return (dispatch) => {
    dispatch({ type: 'LOAD_PROJECTS_PROGRESS' });

    return fetch(PROJECTS_URL)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error('Error while loading projects list.');
      })
      .catch((error) => {
        dispatch({
          type: 'LOAD_PROJECTS_FAIL',
          error,
        });
      })
      .then((data) => {
        if (data) {
          dispatch({
            type: 'LOAD_PROJECTS_SUCCESS',
            projects: data.project,
          });
        }
      });
  };
}

export function hideProjects(ids) {
  return {
    type: 'HIDE_PROJECTS',
    ids,
  };
}

export function showProjects(ids) {
  return {
    type: 'SHOW_PROJECTS',
    ids,
  };
}

export function moveProjectsUp(ids) {
  return {
    type: 'MOVE_PROJECTS_UP',
    ids,
  };
}

export function moveProjectsDown(ids) {
  return {
    type: 'MOVE_PROJECTS_DOWN',
    ids,
  };
}

export function changeHiddenFilter(value) {
  return {
    type: 'CHANGE_HIDDEN_PROJECTS_FILTER',
    value,
  };
}

export function saveProjectsConfiguration() {
  return {
    type: 'SAVE_PROJECTS_CONFIGURATION',
  };
}

export function refreshProjectsConfiguration() {
  return {
    type: 'REFRESH_PROJECTS_CONFIGURATION',
  };
}
