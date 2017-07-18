import React from 'react';
import { shallow } from 'enzyme';

import ConfigureProjectsHiddenSection from './ConfigureProjectsHiddenSection';

function create() {
  return shallow(
    <ConfigureProjectsHiddenSection />,
  );
}

describe('ConfigureProjectsHiddenSection', () => {
  it('should has .configure-projects__section class', () => {
    const wrapper = create();
    expect(wrapper.find('.configure-projects__section').length).toBe(1);
  });

  it('section title should exist', () => {
    const wrapper = create();
    expect(wrapper.find('.configure-projects__section-title').length).toBe(1);
    expect(wrapper.find('.configure-projects__section-title').text()).toEqual('Hidden projects');
  });

  it('should render connected filter', () => {
    const wrapper = create();
    expect(wrapper.find('Connect(FilterProjects)').length).toBe(1);
  });

  describe('select', () => {
    it('should has .configure-projects__select class', () => {
      const wrapper = create();
      expect(wrapper.find('.configure-projects__select').length).toBe(1);
    });

    it('should render connected HiddenProjectsSelect', () => {
      const wrapper = create();
      expect(wrapper.find('Connect(HiddenProjectsSelect)').length).toBe(1);
    });
  });

  describe('ShowButton', () => {
    it('should has .configure-projects__control with modifiers classes for ShowButton', () => {
      const wrapper = create();
      const selector = '.configure-projects__control.configure-projects__control_bottom.configure-projects__control_center';
      expect(wrapper.find(selector).length).toBe(1);
    });

    it('should render connected ShowButton', () => {
      const wrapper = create();
      expect(wrapper.find('Connect(ShowButton)').length).toBe(1);
    });
  });
});
