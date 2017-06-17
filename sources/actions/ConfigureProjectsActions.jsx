import projects from '../__mocks__/projects';

export function loadProjects() {
  return (dispatch) => {
    dispatch({ type: 'LOAD_PROJECTS_PROGRESS' });

    setTimeout(() => {
      dispatch({
        type: 'LOAD_PROJECTS_SUCCESS',
        projects,
      });
    }, 1000);
  };
}
