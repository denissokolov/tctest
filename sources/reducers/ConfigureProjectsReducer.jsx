import { Map, Set } from 'immutable';

import { getSelectedIdsWithChildren } from '../utils/projectSelectUtils';

import ProjectsStorage from '../storages/ProjectsStorage';

const projectsStorage = new ProjectsStorage();

const defaultState = new Map({
  loading: false,
  error: null,
  visibleItems: [],
  visibleSelectedIds: new Set(),
  hiddenItems: [],
  hiddenSelectedIds: new Set(),
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
        .set('visibleItems', projectsStorage.getVisible())
        .set('hiddenItems', projectsStorage.getHidden());

    case 'LOAD_PROJECTS_FAIL':
      return state
        .set('loading', false)
        .set('error', action.error ? action.error.message : '');

    case 'SHOW_PROJECTS':
      projectsStorage.showItems(
        getSelectedIdsWithChildren(state.get('hiddenSelectedIds'), state.get('hiddenItems')),
      );
      return state
        .set('visibleItems', projectsStorage.getVisible())
        .set('visibleSelectedIds', state.get('hiddenSelectedIds'))
        .set('firstChangedVisibleIndex', projectsStorage.getFirstChangedVisibleIndex())
        .set('hiddenItems', projectsStorage.getHidden())
        .set('hiddenSelectedIds', new Set());

    case 'SHOW_PROJECT': {
      const ids = new Set([action.id]);
      projectsStorage.showItems(
        getSelectedIdsWithChildren(ids, state.get('hiddenItems')),
      );
      return state
        .set('visibleItems', projectsStorage.getVisible())
        .set('visibleSelectedIds', ids)
        .set('firstChangedVisibleIndex', projectsStorage.getFirstChangedVisibleIndex())
        .set('hiddenItems', projectsStorage.getHidden());
    }

    case 'HIDE_PROJECTS':
      projectsStorage.hideItems(
        getSelectedIdsWithChildren(state.get('visibleSelectedIds'), state.get('visibleItems')),
      );
      return state
        .set('visibleItems', projectsStorage.getVisible())
        .set('visibleSelectedIds', new Set())
        .set('hiddenItems', projectsStorage.getHidden())
        .set('hiddenSelectedIds', state.get('visibleSelectedIds'))
        .set('firstChangedHiddenIndex', projectsStorage.getFirstChangedHiddenIndex());

    case 'HIDE_PROJECT': {
      const ids = new Set([action.id]);
      projectsStorage.hideItems(
        getSelectedIdsWithChildren(ids, state.get('visibleItems')),
      );
      return state
        .set('visibleItems', projectsStorage.getVisible())
        .set('hiddenItems', projectsStorage.getHidden())
        .set('hiddenSelectedIds', ids)
        .set('firstChangedHiddenIndex', projectsStorage.getFirstChangedHiddenIndex());
    }

    case 'MOVE_PROJECTS_UP': {
      const sortChanged = projectsStorage.sortUpVisible(state.get('visibleSelectedIds'));
      return sortChanged
        ? state
            .set('visibleItems', projectsStorage.getVisible())
            .set('customSort', true)
            .set('firstChangedVisibleIndex', projectsStorage.getFirstChangedVisibleIndex())
        : state;
    }

    case 'MOVE_PROJECTS_DOWN': {
      const sortChanged = projectsStorage.sortDownVisible(state.get('visibleSelectedIds'));
      return sortChanged
        ? state
            .set('visibleItems', projectsStorage.getVisible())
            .set('customSort', true)
            .set('firstChangedVisibleIndex', projectsStorage.getFirstChangedVisibleIndex())
        : state;
    }

    case 'CHANGE_HIDDEN_PROJECTS_FILTER': {
      projectsStorage.filterHidden(action.value);
      const hiddenItems = projectsStorage.getHidden();

      return state
        .set('hiddenItems', hiddenItems)
        .set('hiddenFilterValue', action.value)
        .set('firstChangedHiddenIndex', hiddenItems.size > 0 ? 0 : null);
    }

    case 'SAVE_PROJECTS_CONFIGURATION':
      projectsStorage.saveState();
      return state
        .set('hiddenFilterValue', '')
        .set('visibleSelectedIds', new Set())
        .set('hiddenSelectedIds', new Set());

    case 'REFRESH_PROJECTS_CONFIGURATION':
      projectsStorage.refreshToSavedState();
      return state
        .set('visibleItems', projectsStorage.getVisible())
        .set('hiddenItems', projectsStorage.getHidden())
        .set('hiddenFilterValue', '')
        .set('customSort', false)
        .set('visibleSelectedIds', new Set())
        .set('hiddenSelectedIds', new Set());

    case 'CHANGE_HIDDEN_SELECTED_PROJECTS':
      return state.set('hiddenSelectedIds', action.selectedIds);

    case 'CHANGE_VISIBLE_SELECTED_PROJECTS':
      return state.set('visibleSelectedIds', action.selectedIds);

    default:
      return state;
  }
}
export default ConfigureProjectsReducer;
