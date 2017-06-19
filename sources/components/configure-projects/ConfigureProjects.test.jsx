import React from 'react';
import { shallow, mount } from 'enzyme';
import { fromJS } from 'immutable';

import projects from '../../__mocks__/projects';
import { ConfigureProjects } from './ConfigureProjects';
import Projects from './visible-projects/Projects';

function create({
                  visible = [],
                  hidden = [],
                  loading = false,
                  dispatch = jest.fn(),
                }, needMount = false) {
  const configureProjects = fromJS({
    loading,
    visible,
    hidden,
  });

  const render = needMount ? mount : shallow;

  return render(
    <ConfigureProjects
      configureProjects={configureProjects}
      dispatch={dispatch}
    />,
  );
}

describe('ConfigureProjects', () => {
  it('should no render Projects for empty list', () => {
    const wrapper = create({});
    expect(wrapper.find(Projects).length).toBe(0);
  });

  it('should render Projects for filled list', () => {
    const wrapper = create({ visible: projects });
    expect(wrapper.find(Projects).length).toBe(1);
  });

  it('dispatch should be called on componentDidMount', () => {
    const dispatch = jest.fn();
    create({ dispatch }, true);
    expect(dispatch).toBeCalled();
  });

  it('should no render loading for false configureProjects property', () => {
    const wrapper = create({ loading: false });
    expect(wrapper.find('span').length).toBe(0);
  });

  it('should render loading for true configureProjects property', () => {
    const wrapper = create({ loading: true });
    const span = wrapper.find('span');

    expect(span.length).toBe(1);
    expect(span.text()).toBe('Loading...');
  });
});
