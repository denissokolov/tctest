import React from 'react';
import { shallow, mount } from 'enzyme';
import { fromJS } from 'immutable';

import { ConfigureProjects } from './ConfigureProjects';

function create({
                  visible = [],
                  hidden = [],
                  loading = false,
                  dispatch = jest.fn(),
                  close = jest.fn(),
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
      close={close}
    />,
  );
}

describe('ConfigureProjects', () => {
  it('should has .configure-projects class', () => {
    const wrapper = create({});
    expect(wrapper.find('.configure-projects').length).toBe(1);
  });

  it('dispatch should be called on componentDidMount', () => {
    const dispatch = jest.fn();
    create({ dispatch }, true);
    expect(dispatch).toBeCalled();
  });

  it('should no render loading for false configureProjects property', () => {
    const wrapper = create({ loading: false });
    const loadingBlock = wrapper.find('.configure-projects__loading');

    expect(loadingBlock.length).toBe(0);
  });

  it('should render loading for true configureProjects property', () => {
    const wrapper = create({ loading: true });
    const loadingBlock = wrapper.find('.configure-projects__loading');

    expect(loadingBlock.length).toBe(1);
    expect(loadingBlock.text()).toBe('Loading...');
  });
});
