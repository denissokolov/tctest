import { fromJS } from 'immutable';
import ConfigureProjectsReducer from './ConfigureProjectsReducer';
import projects from '../__mocks__/projects';

describe('ConfigureProjectsReducer', () => {
  it('should return the initial state', () => {
    const state = ConfigureProjectsReducer(undefined, {});

    expect(state).toEqual(fromJS({
      loading: false,
      error: null,
      visible: [],
      hidden: [],
    }));
  });

  it('should handle LOAD_PROJECTS_PROGRESS', () => {
    const action = {
      type: 'LOAD_PROJECTS_PROGRESS',
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('loading')).toBeTruthy();
  });

  it('should handle LOAD_PROJECTS_SUCCESS', () => {
    const action = {
      type: 'LOAD_PROJECTS_SUCCESS',
      projects,
    };

    const state = ConfigureProjectsReducer(undefined, action);

    expect(state.get('loading')).toBeFalsy();
    expect(state.get('error')).toBeNull();
    expect(state.get('visible')).toEqual(fromJS(action.projects));
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
});
