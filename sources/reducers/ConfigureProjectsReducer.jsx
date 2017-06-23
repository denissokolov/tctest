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
      return state
        .set('loading', false)
        .set('visible', fromJS(action.visible))
        .set('hidden', fromJS(action.hidden));
    }

    case 'LOAD_PROJECTS_FAIL':
      return state
        .set('loading', false)
        .set('error', action.error);

    case 'SHOW_PROJECTS':
    case 'HIDE_PROJECTS':
      return state
        .set('visible', fromJS(action.visible))
        .set('hidden', fromJS(action.hidden));

    default:
      return state;
  }
}
export default ConfigureProjectsReducer;