export function loadProjects() {
  return (dispatch) => {
    dispatch({ type: 'LOAD_PROJECTS_PROGRESS' });

    // TODO: add polyfill
    // eslint-disable-next-line no-undef
    fetch('data.json')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        dispatch({
          type: 'LOAD_PROJECTS_SUCCESS',
          projects: data.project,
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
