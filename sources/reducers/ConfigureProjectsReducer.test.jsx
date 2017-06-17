import { fromJS } from 'immutable';
import ConfigureProjectsReducer from './ConfigureProjectsReducer';
import projects from '../__mocks__/projects';

describe('ConfigureProjectsReducer', () => {
  it('should return the initial state', () => {
    const state = ConfigureProjectsReducer(undefined, {});

    expect(state).toEqual(fromJS({
      loading: false,
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
    expect(state.get('visible')).toEqual(fromJS(action.projects));
  });
});
