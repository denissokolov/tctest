import { fromJS } from 'immutable';
import ConfigureProjectsReducer from './ConfigureProjectsReducer';

import formattedProjects from '../__mocks__/formattedProjects';

describe('ConfigureProjectsReducer', () => {
  it('should return the initial state', () => {
    const state = ConfigureProjectsReducer(undefined, {});

    expect(state).toEqual(fromJS({
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
    expect(state.get('visible')).toEqual(fromJS(action.visible));
    expect(state.get('hidden')).toEqual(fromJS(action.hidden));
  });

  it('should handle LOAD_PROJECTS_FAIL', () => {
    const action = {
      type: 'LOAD_PROJECTS_FAIL',
      error: new Error('test'),
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('loading')).toBeFalsy();
    expect(state.get('error')).toEqual(action.error);
  });

  it('LOAD_PROJECTS_PROGRESS should reset error', () => {
    let action = {
      type: 'LOAD_PROJECTS_FAIL',
      error: new Error('test'),
    };
    let state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('error')).toEqual(action.error);

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

    expect(state.get('visible')).toEqual(fromJS(action.visible));
    expect(state.get('hidden')).toEqual(fromJS(action.hidden));
  });

  it('should handle HIDE_PROJECTS', () => {
    const action = {
      type: 'HIDE_PROJECTS',
      visible: formattedProjects,
      hidden: formattedProjects.reverse(),
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('visible')).toEqual(fromJS(action.visible));
    expect(state.get('hidden')).toEqual(fromJS(action.hidden));
  });

  it('should handle MOVE_PROJECTS_UP if action.sortChanged is true', () => {
    const action = {
      type: 'MOVE_PROJECTS_UP',
      items: formattedProjects,
      sortChanged: true,
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('visible')).toEqual(fromJS(action.items));
    expect(state.get('customSort')).toBeTruthy();
  });

  it('should return previous state for action MOVE_PROJECTS_UP if action.sortChanged is false', () => {
    const action = {
      type: 'MOVE_PROJECTS_UP',
      items: formattedProjects,
      sortChanged: false,
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('visible')).toEqual(fromJS([]));
    expect(state.get('customSort')).toBeFalsy();
  });

  it('should handle MOVE_PROJECTS_DOWN if action.sortChanged is true', () => {
    const action = {
      type: 'MOVE_PROJECTS_DOWN',
      items: formattedProjects.reverse(),
      sortChanged: true,
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('visible')).toEqual(fromJS(action.items));
    expect(state.get('customSort')).toBeTruthy();
  });

  it('should return previous state for action MOVE_PROJECTS_DOWN if action.sortChanged is false', () => {
    const action = {
      type: 'MOVE_PROJECTS_DOWN',
      items: formattedProjects.reverse(),
      sortChanged: false,
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('visible')).toEqual(fromJS([]));
    expect(state.get('customSort')).toBeFalsy();
  });
});
