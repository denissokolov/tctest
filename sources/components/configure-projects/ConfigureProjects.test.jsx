import React from 'react';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import ConfigureProjects from './ConfigureProjects';
import ConfigureProjectsFooter from './footer/ConfigureProjectsFooter';
import ConfigureProjectsVisibleSection from './sections/ConfigureProjectsVisibleSection';
import ConfigureProjectsHiddenSection from './sections/ConfigureProjectsHiddenSection';

function create(props) {
  const {
    configureProjects = { visible: [], hidden: [], hiddenFilterValue: '' },
    dispatch = jest.fn(),
    onSubmit = jest.fn(),
    onCancel = jest.fn(),
    formVisible = true,
  } = props;

  return shallow(
    <ConfigureProjects
      configureProjects={Map(configureProjects)}
      dispatch={dispatch}
      onSubmit={onSubmit}
      onCancel={onCancel}
      formVisible={formVisible}
    />,
  );
}

describe('ConfigureProjectsHiddenSection', () => {
  it('should has .configure-projects', () => {
    const wrapper = create({});
    expect(wrapper.find('.configure-projects').length).toBe(1);
  });

  it('should be form', () => {
    const wrapper = create({});
    expect(wrapper.type()).toEqual('form');
  });

  it('should render ConfigureProjectsVisibleSection', () => {
    const wrapper = create({});
    expect(wrapper.find(ConfigureProjectsVisibleSection).length).toBe(1);
  });

  it('should render ConfigureProjectsHiddenSection', () => {
    const wrapper = create({});
    expect(wrapper.find(ConfigureProjectsHiddenSection).length).toBe(1);
  });

  describe('footer', () => {
    it('should render ConfigureProjectsFooter', () => {
      const wrapper = create({});
      expect(wrapper.find(ConfigureProjectsFooter).length).toBe(1);
    });

    it('should call onCancel property on ConfigureProjectsFooter onCancelClick called', () => {
      const onCancel = jest.fn();
      const wrapper = create({ onCancel });
      wrapper.find(ConfigureProjectsFooter).prop('onCancelClick')();

      expect(onCancel).toBeCalled();
    });

    it('should call onSubmit property on form submit', () => {
      const onSubmit = jest.fn();
      const wrapper = create({ onSubmit });

      const preventDefault = jest.fn();
      wrapper.simulate('submit', { preventDefault });

      expect(onSubmit).toBeCalled();
      expect(preventDefault).toBeCalled();
    });
  });
});
