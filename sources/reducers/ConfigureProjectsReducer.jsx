import { fromJS } from 'immutable';

const defaultState = fromJS({
  loading: false,
  error: null,
  visible: [],
  hidden: [],
  customSort: false,
  hiddenFilterActive: false,
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

    case 'MOVE_PROJECTS_UP':
    case 'MOVE_PROJECTS_DOWN':
      return state
        .set('visible', fromJS(action.items))
        .set('customSort', action.sortChanged ? true : state.get('customSort'));

    case 'CHANGE_HIDDEN_PROJECTS_FILTER':
      return state
        .set('hidden', fromJS(action.items))
        .set('hiddenFilterActive', Boolean(action.value));

    case 'SAVE_PROJECTS_CONFIGURATION':
      return state.set('hiddenFilterActive', false);

    case 'REFRESH_PROJECTS_CONFIGURATION':
      return state
        .set('visible', fromJS(action.visible))
        .set('hidden', fromJS(action.hidden))
        .set('hiddenFilterActive', false)
        .set('customSort', false);

    default:
      return state;
  }
}
export default ConfigureProjectsReducer;
