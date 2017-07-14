/* global fetch */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from './ConfigureProjectsActions';
import serverProjects from '../__mocks__/serverProjects';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../storages/ProjectsStorage');

describe('ConfigureProjectsActions', () => {
  beforeAll(() => {
    global.PROJECTS_URL = '/test';
  });

  afterAll(() => {
    global.PROJECTS_URL = undefined;
  });

  describe('loadProjects', () => {
    it('should create actions LOAD_PROJECTS_PROGRESS & LOAD_PROJECTS_FAIL for invalid server response status', () => {
      fetch.mockResponse('', { status: 500 });

      const expectedActions = [
        { type: 'LOAD_PROJECTS_PROGRESS' },
        { error: new Error('Error while loading projects list.'), type: 'LOAD_PROJECTS_FAIL' },
      ];

      const store = mockStore();

      return store.dispatch(actions.loadProjects()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });


    it('should create actions LOAD_PROJECTS_PROGRESS & LOAD_PROJECTS_SUCCESS for valid server response', () => {
      fetch.mockResponse(JSON.stringify(serverProjects), { status: 200 });

      const expectedActions = [
        { type: 'LOAD_PROJECTS_PROGRESS' },
        { type: 'LOAD_PROJECTS_SUCCESS' },
      ];

      const store = mockStore();

      return store.dispatch(actions.loadProjects()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  it('hideProjects should create action HIDE_PROJECTS', () => {
    expect(actions.hideProjects([])).toEqual({ type: 'HIDE_PROJECTS' });
  });

  it('showProjects should create action SHOW_PROJECTS', () => {
    expect(actions.showProjects([])).toEqual({ type: 'SHOW_PROJECTS' });
  });

  it('moveProjectsUp should create action MOVE_PROJECTS_UP', () => {
    expect(actions.moveProjectsUp([])).toEqual({ type: 'MOVE_PROJECTS_UP' });
  });

  it('moveProjectsDown should create action MOVE_PROJECTS_DOWN', () => {
    expect(actions.moveProjectsDown([])).toEqual({ type: 'MOVE_PROJECTS_DOWN' });
  });

  it('changeHiddenFilter should create action CHANGE_HIDDEN_PROJECTS_FILTER', () => {
    expect(actions.changeHiddenFilter('test')).toEqual({
      type: 'CHANGE_HIDDEN_PROJECTS_FILTER',
      value: 'test',
    });
  });

  it('saveProjectsConfiguration should create action SAVE_PROJECTS_CONFIGURATION', () => {
    expect(actions.saveProjectsConfiguration()).toEqual({ type: 'SAVE_PROJECTS_CONFIGURATION' });
  });

  it('refreshProjectsConfiguration should create action REFRESH_PROJECTS_CONFIGURATION', () => {
    expect(actions.refreshProjectsConfiguration()).toEqual({ type: 'REFRESH_PROJECTS_CONFIGURATION' });
  });
});
