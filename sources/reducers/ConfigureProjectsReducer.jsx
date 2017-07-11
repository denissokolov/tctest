import { Map } from 'immutable';

const defaultState = Map({
  loading: false,
  error: null,
  visible: [],
  hidden: [],
  customSort: false,
  hiddenFilterValue: '',
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
        .set('visible', action.visible)
        .set('hidden', action.hidden);
    }

    case 'LOAD_PROJECTS_FAIL':
      return state
        .set('loading', false)
        .set('error', action.error ? action.error.message : '');

    case 'SHOW_PROJECTS':
    case 'HIDE_PROJECTS':
      return state
        .set('visible', action.visible)
        .set('hidden', action.hidden);

    case 'MOVE_PROJECTS_UP':
    case 'MOVE_PROJECTS_DOWN':
      if (!action.sortChanged) {
        return state;
      }

      return state
        .set('visible', action.items)
        .set('customSort', true);

    case 'CHANGE_HIDDEN_PROJECTS_FILTER':
      return state
        .set('hidden', action.items)
        .set('hiddenFilterValue', action.value);

    case 'SAVE_PROJECTS_CONFIGURATION':
      return state.set('hiddenFilterValue', '');

    case 'REFRESH_PROJECTS_CONFIGURATION':
      return state
        .set('visible', action.visible)
        .set('hidden', action.hidden)
        .set('hiddenFilterValue', '')
        .set('customSort', false);

    default:
      return state;
  }
}
export default ConfigureProjectsReducer;
