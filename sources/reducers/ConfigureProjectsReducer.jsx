import { Map, Set } from 'immutable';

import { getSelectedIdsWithChildren } from '../utils/projectSelectUtils';

import ProjectsStorage from '../storages/ProjectsStorage';

const projectsStorage = new ProjectsStorage();

const defaultState = new Map({
  loading: false,
  error: null,
  visibleItems: [],
  visibleSelectedIds: new Set(),
  noScrollVisibleList: false,
  hiddenItems: [],
  hiddenSelectedIds: new Set(),
  noScrollHiddenList: false,
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
        .set('hiddenSelectedIds', new Set())
        .set('noScrollVisibleList', false)
        .set('noScrollHiddenList', false);

    case 'SHOW_PROJECT': {
      const ids = new Set([action.id]);
      projectsStorage.showItems(
        getSelectedIdsWithChildren(ids, state.get('hiddenItems')),
      );
      return state
        .set('visibleItems', projectsStorage.getVisible())
        .set('visibleSelectedIds', ids)
        .set('firstChangedVisibleIndex', projectsStorage.getFirstChangedVisibleIndex())
        .set('hiddenItems', projectsStorage.getHidden())
        .set('noScrollVisibleList', false)
        .set('noScrollHiddenList', true);
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
        .set('firstChangedHiddenIndex', projectsStorage.getFirstChangedHiddenIndex())
        .set('noScrollVisibleList', false)
        .set('noScrollHiddenList', false);

    case 'HIDE_PROJECT': {
      const ids = new Set([action.id]);
      projectsStorage.hideItems(
        getSelectedIdsWithChildren(ids, state.get('visibleItems')),
      );
      return state
        .set('visibleItems', projectsStorage.getVisible())
        .set('hiddenItems', projectsStorage.getHidden())
        .set('hiddenSelectedIds', ids)
        .set('firstChangedHiddenIndex', projectsStorage.getFirstChangedHiddenIndex())
        .set('noScrollVisibleList', true)
        .set('noScrollHiddenList', false);
    }

    case 'MOVE_PROJECTS_UP': {
      const sortChanged = projectsStorage.sortUpVisible(state.get('visibleSelectedIds'));
      return sortChanged
        ? state
            .set('visibleItems', projectsStorage.getVisible())
            .set('customSort', true)
            .set('noScrollVisibleList', false)
            .set('firstChangedVisibleIndex', projectsStorage.getFirstChangedVisibleIndex())
        : state;
    }

    case 'MOVE_PROJECTS_DOWN': {
      const sortChanged = projectsStorage.sortDownVisible(state.get('visibleSelectedIds'));
      return sortChanged
        ? state
            .set('visibleItems', projectsStorage.getVisible())
            .set('customSort', true)
            .set('noScrollVisibleList', false)
            .set('firstChangedVisibleIndex', projectsStorage.getFirstChangedVisibleIndex())
        : state;
    }

    case 'CHANGE_HIDDEN_PROJECTS_FILTER': {
      projectsStorage.filterHidden(action.value);
      const hiddenItems = projectsStorage.getHidden();

      return state
        .set('hiddenItems', hiddenItems)
        .set('hiddenFilterValue', action.value)
        .set('firstChangedHiddenIndex', hiddenItems.length > 0 ? 0 : null)
        .set('noScrollHiddenList', false);
    }

    case 'SAVE_PROJECTS_CONFIGURATION':
      projectsStorage.saveState();
      return state
        .set('visibleSelectedIds', new Set())
        .set('firstChangedVisibleIndex', null)
        .set('hiddenFilterValue', '')
        .set('hiddenItems', projectsStorage.getHidden())
        .set('hiddenSelectedIds', new Set())
        .set('firstChangedHiddenIndex', null)
        .set('noScrollVisibleList', false)
        .set('noScrollHiddenList', false);

    case 'REFRESH_PROJECTS_CONFIGURATION':
      projectsStorage.refreshToSavedState();
      return state
        .set('visibleItems', projectsStorage.getVisible())
        .set('visibleSelectedIds', new Set())
        .set('firstChangedVisibleIndex', null)
        .set('hiddenItems', projectsStorage.getHidden())
        .set('hiddenFilterValue', '')
        .set('customSort', false)
        .set('hiddenSelectedIds', new Set())
        .set('firstChangedHiddenIndex', null)
        .set('noScrollVisibleList', false)
        .set('noScrollHiddenList', false);

    case 'CHANGE_HIDDEN_SELECTED_PROJECTS':
      return state
        .set('hiddenSelectedIds', action.selectedIds)
        .set('noScrollHiddenList', false);

    case 'CHANGE_VISIBLE_SELECTED_PROJECTS':
      return state
        .set('visibleSelectedIds', action.selectedIds)
        .set('noScrollVisibleList', false);

    default:
      return state;
  }
}
export default ConfigureProjectsReducer;
