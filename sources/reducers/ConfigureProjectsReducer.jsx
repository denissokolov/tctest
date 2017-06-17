import { fromJS } from 'immutable';

const defaultState = fromJS({
  loading: false,
  visible: [],
  hidden: [],
});

function ConfigureProjectsReducer(state = defaultState, action = {}) {
  switch (action.type) {
    case 'LOAD_PROJECTS_PROGRESS':
      return state.set('loading', true);

    case 'LOAD_PROJECTS_SUCCESS':
      return state
        .set('loading', false)
        .set('visible', fromJS(action.projects));

    default:
      return state;
  }
}
export default ConfigureProjectsReducer;
