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

export function hideProjects() {
  return {
    type: 'HIDE_PROJECTS',
  };
}

export function hideProject(id) {
  return {
    type: 'HIDE_PROJECT',
    id,
  };
}

export function showProjects() {
  return {
    type: 'SHOW_PROJECTS',
  };
}

export function showProject(id) {
  return {
    type: 'SHOW_PROJECT',
    id,
  };
}

export function moveProjectsUp() {
  return {
    type: 'MOVE_PROJECTS_UP',
  };
}

export function moveProjectsDown() {
  return {
    type: 'MOVE_PROJECTS_DOWN',
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

export function changeHiddenSelectedProjects(selectedIds) {
  return {
    type: 'CHANGE_HIDDEN_SELECTED_PROJECTS',
    selectedIds,
  };
}

export function changeVisibleSelectedProjects(selectedIds) {
  return {
    type: 'CHANGE_VISIBLE_SELECTED_PROJECTS',
    selectedIds,
  };
}
