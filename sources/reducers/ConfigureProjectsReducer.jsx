import { fromJS } from 'immutable';

const defaultState = fromJS({
  loading: false,
  error: null,
  visible: [],
  hidden: [],
});

function ConfigureProjectsReducer(state = defaultState, action = {}) {
  switch (action.type) {
    case 'LOAD_PROJECTS_PROGRESS':
      return state
        .set('loading', true)
        .set('error', null);

    case 'LOAD_PROJECTS_SUCCESS': {
      const depthObj = {};
      const projects = [];

      action.projects.forEach((project) => {
        const formattedProject = {};
        formattedProject.id = project.id;
        formattedProject.name = project.name;

        if (project.parentProject) {
          formattedProject.depth = depthObj[project.parentProject.id] + 1;
          formattedProject.parentProjectId = project.parentProject.id;
        } else {
          formattedProject.depth = 0;
        }

        depthObj[project.id] = formattedProject.depth;

        projects.push(formattedProject);
      });

      return state
        .set('loading', false)
        .set('visible', fromJS(projects));
    }

    case 'LOAD_PROJECTS_FAIL':
      return state
        .set('loading', false)
        .set('error', action.error);

    default:
      return state;
  }
}
export default ConfigureProjectsReducer;
