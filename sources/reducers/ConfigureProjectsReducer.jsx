import { Map } from 'immutable';

import ProjectsStorage from '../storages/ProjectsStorage';

const projectsStorage = new ProjectsStorage();

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

    case 'LOAD_PROJECTS_SUCCESS':
      projectsStorage.fillFromServerData(action.projects);
      return state
        .set('loading', false)
        .set('visible', projectsStorage.getVisible())
        .set('hidden', projectsStorage.getHidden());

    case 'LOAD_PROJECTS_FAIL':
      return state
        .set('loading', false)
        .set('error', action.error ? action.error.message : '');

    case 'SHOW_PROJECTS':
      projectsStorage.showItems(action.ids);
      return state
        .set('visible', action.getVisible())
        .set('hidden', action.getHidden());

    case 'HIDE_PROJECTS':
      projectsStorage.hideItems(action.ids);
      return state
        .set('visible', action.getVisible())
        .set('hidden', action.getHidden());

    case 'MOVE_PROJECTS_UP': {
      const sortChanged = projectsStorage.sortUpVisible(action.ids);
      return sortChanged
        ? state.set('visible', action.getVisible()).set('customSort', true)
        : state;
    }

    case 'MOVE_PROJECTS_DOWN': {
      const sortChanged = projectsStorage.sortDownVisible(action.ids);
      return sortChanged
        ? state.set('visible', action.getVisible()).set('customSort', true)
        : state;
    }

    case 'CHANGE_HIDDEN_PROJECTS_FILTER':
      projectsStorage.filterHidden(action.value);
      return state
        .set('hidden', action.getHidden())
        .set('hiddenFilterValue', action.value);

    case 'SAVE_PROJECTS_CONFIGURATION':
      projectsStorage.saveState();
      return state.set('hiddenFilterValue', '');

    case 'REFRESH_PROJECTS_CONFIGURATION':
      projectsStorage.refreshToSavedState();
      return state
        .set('visible', action.getVisible())
        .set('hidden', action.getHidden())
        .set('hiddenFilterValue', '')
        .set('customSort', false);

    default:
      return state;
  }
}
export default ConfigureProjectsReducer;
