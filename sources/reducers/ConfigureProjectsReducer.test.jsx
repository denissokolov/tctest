import { Map } from 'immutable';
import ConfigureProjectsReducer from './ConfigureProjectsReducer';

import formattedProjects from '../__mocks__/formattedProjects';

describe('ConfigureProjectsReducer', () => {
  it('should return the initial state', () => {
    const state = ConfigureProjectsReducer(undefined, {});

    expect(state).toEqual(Map({
      loading: false,
      error: null,
      visible: [],
      hidden: [],
      customSort: false,
      hiddenFilterValue: '',
    }));
  });

  it('should handle LOAD_PROJECTS_PROGRESS', () => {
    const action = {
      type: 'LOAD_PROJECTS_PROGRESS',
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('loading')).toBeTruthy();
    expect(state.get('error')).toBeNull();
  });

  it('should handle LOAD_PROJECTS_SUCCESS', () => {
    const action = {
      type: 'LOAD_PROJECTS_SUCCESS',
      visible: formattedProjects,
      hidden: [],
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('loading')).toBeFalsy();
    expect(state.get('error')).toBeNull();
    expect(state.get('visible')).toEqual(action.visible);
    expect(state.get('hidden')).toEqual(action.hidden);
  });

  it('should handle LOAD_PROJECTS_FAIL', () => {
    const action = {
      type: 'LOAD_PROJECTS_FAIL',
      error: new Error('test'),
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('loading')).toBeFalsy();
    expect(state.get('error')).toEqual(action.error.message);
  });

  it('LOAD_PROJECTS_PROGRESS should reset error', () => {
    let action = {
      type: 'LOAD_PROJECTS_FAIL',
      error: new Error('test'),
    };
    let state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('error')).toEqual(action.error.message);

    action = {
      type: 'LOAD_PROJECTS_PROGRESS',
    };
    state = ConfigureProjectsReducer(state, action);

    expect(state.get('error')).toBeNull();
  });

  it('should handle SHOW_PROJECTS', () => {
    const action = {
      type: 'SHOW_PROJECTS',
      visible: formattedProjects,
      hidden: formattedProjects.reverse(),
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('visible')).toEqual(action.visible);
    expect(state.get('hidden')).toEqual(action.hidden);
  });

  it('should handle HIDE_PROJECTS', () => {
    const action = {
      type: 'HIDE_PROJECTS',
      visible: formattedProjects,
      hidden: formattedProjects.reverse(),
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('visible')).toEqual(action.visible);
    expect(state.get('hidden')).toEqual(action.hidden);
  });

  it('should handle MOVE_PROJECTS_UP if action.sortChanged is true', () => {
    const action = {
      type: 'MOVE_PROJECTS_UP',
      items: formattedProjects,
      sortChanged: true,
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('visible')).toEqual(action.items);
    expect(state.get('customSort')).toBeTruthy();
  });

  it('should return previous state for action MOVE_PROJECTS_UP if action.sortChanged is false', () => {
    const action = {
      type: 'MOVE_PROJECTS_UP',
      items: formattedProjects,
      sortChanged: false,
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('visible')).toEqual([]);
    expect(state.get('customSort')).toBeFalsy();
  });

  it('should handle MOVE_PROJECTS_DOWN if action.sortChanged is true', () => {
    const action = {
      type: 'MOVE_PROJECTS_DOWN',
      items: formattedProjects.reverse(),
      sortChanged: true,
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('visible')).toEqual(action.items);
    expect(state.get('customSort')).toBeTruthy();
  });

  it('should return previous state for action MOVE_PROJECTS_DOWN if action.sortChanged is false', () => {
    const action = {
      type: 'MOVE_PROJECTS_DOWN',
      items: formattedProjects.reverse(),
      sortChanged: false,
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('visible')).toEqual([]);
    expect(state.get('customSort')).toBeFalsy();
  });

  it('should handle CHANGE_HIDDEN_PROJECTS_FILTER', () => {
    const action = {
      type: 'CHANGE_HIDDEN_PROJECTS_FILTER',
      items: formattedProjects.reverse(),
      value: 'test',
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('hidden')).toEqual(action.items);
    expect(state.get('hiddenFilterValue')).toEqual(action.value);
  });

  it('should handle SAVE_PROJECTS_CONFIGURATION', () => {
    const action = {
      type: 'SAVE_PROJECTS_CONFIGURATION',
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('hiddenFilterValue')).toEqual('');
  });

  it('should handle REFRESH_PROJECTS_CONFIGURATION', () => {
    const action = {
      type: 'REFRESH_PROJECTS_CONFIGURATION',
      visible: formattedProjects,
      hidden: formattedProjects.reverse(),
    };

    const state = ConfigureProjectsReducer(Map({
      visible: [],
      hidden: [],
      customSort: true,
      hiddenFilterValue: 'test',
    }), action);

    expect(state.get('visible')).toEqual(action.visible);
    expect(state.get('hidden')).toEqual(action.hidden);
    expect(state.get('hiddenFilterValue')).toEqual('');
    expect(state.get('customSort')).toBeFalsy();
  });
});
