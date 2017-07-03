import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import formattedProjects from '../../../__mocks__/formattedProjects';
import ConfigureProjectsVisibleSection from './ConfigureProjectsVisibleSection';
import ProjectsSelect, { types as projectsSelectTypes } from '../project-select/ProjectsSelect';
import ArrowButton, { directions } from '../../arrow-button/ArrowButton';

function create(props) {
  const {
    visible = [],
    hideProjects = jest.fn(),
    moveProjectsUp = jest.fn(),
    moveProjectsDown = jest.fn(),
    formVisible = true,
  } = props;

  return shallow(
    <ConfigureProjectsVisibleSection
      visible={fromJS(visible)}
      hideProjects={hideProjects}
      moveProjectsUp={moveProjectsUp}
      moveProjectsDown={moveProjectsDown}
      formVisible={formVisible}
    />,
  );
}

const selectedOptions = [{
  value: '_Root',
}, {
  value: 'OpenSourceProjects',
}, {
  value: 'ApacheAnt',
  selected: true,
}, {
  value: 'Hibernate',
  selected: true,
}, {
  value: 'Hibernate_HibernateOrm',
}, {
  value: 'cb_Root',
}, {
  value: 'Nose',
}, {
  value: 'Less',
}];

describe('ConfigureProjectsVisibleSection', () => {
  it('should has .configure-projects__section class', () => {
    const wrapper = create({});
    expect(wrapper.find('.configure-projects__section').length).toBe(1);
  });

  it('section title should exist', () => {
    const wrapper = create({});
    expect(wrapper.find('.configure-projects__section-title').length).toBe(1);
    expect(wrapper.find('.configure-projects__section-title').text()).toEqual('Visible projects');
  });

  describe('select', () => {
    it('should has .configure-projects__select class', () => {
      const wrapper = create({});
      expect(wrapper.find('.configure-projects__select').length).toBe(1);
    });

    it('should render ProjectsSelect', () => {
      const wrapper = create({
        visible: formattedProjects,
        formVisible: false,
      });
      const select = wrapper.find(ProjectsSelect);

      expect(select.prop('type')).toEqual(projectsSelectTypes.visible);
      expect(select.prop('formVisible')).toBeFalsy();
    });

    it('should set property anyVisibleSelected to state on ProjectsSelect change', () => {
      const wrapper = create({
        visible: formattedProjects,
      });
      const select = wrapper.find(ProjectsSelect);

      expect(wrapper.state('anyVisibleSelected')).toBeFalsy();

      select.simulate('change', { target: { options: selectedOptions } });
      expect(wrapper.state('anyVisibleSelected')).toBeTruthy();

      select.simulate('change', { target: { options: selectedOptions } });
      expect(wrapper.state('anyVisibleSelected')).toBeTruthy();
    });
  });

  describe('move up button', () => {
    it('should has .configure-projects__control with modifiers classes', () => {
      const wrapper = create({});
      const selector = '.configure-projects__control.configure-projects__control_top.configure-projects__control_left';
      expect(wrapper.find(selector).length).toBe(1);
    });

    it('should render ArrowButton', () => {
      const wrapper = create({});
      const hideButton = wrapper.find(ArrowButton).at(0);
      expect(hideButton.prop('direction')).toEqual(directions.up);
    });

    it('ArrowButton should be enabled on select change', () => {
      const wrapper = create({
        visible: formattedProjects,
      });

      const select = wrapper.find(ProjectsSelect);

      let hideButton = wrapper.find(ArrowButton).at(0);
      expect(hideButton.prop('disabled')).toBeTruthy();

      select.simulate('change', { target: { options: selectedOptions } });

      hideButton = wrapper.find(ArrowButton).at(0);
      expect(hideButton.prop('disabled')).toBeFalsy();
    });

    it('should call property showProjects on button click', () => {
      const moveProjectsUp = jest.fn();
      const wrapper = create({
        visible: formattedProjects,
        moveProjectsUp,
      });

      const select = wrapper.find(ProjectsSelect);
      select.simulate('change', { target: { options: selectedOptions } });

      const hideButton = wrapper.find(ArrowButton).at(0);
      hideButton.simulate('click');

      expect(moveProjectsUp).toBeCalled();
      expect(moveProjectsUp.mock.calls[0][0]).toEqual(['ApacheAnt', 'Hibernate']);
    });
  });

  describe('move down button', () => {
    it('should has .configure-projects__control with modifiers classes', () => {
      const wrapper = create({});
      const selector = '.configure-projects__control.configure-projects__control_bottom.configure-projects__control_left';
      expect(wrapper.find(selector).length).toBe(1);
    });

    it('should render ArrowButton', () => {
      const wrapper = create({});
      const hideButton = wrapper.find(ArrowButton).at(1);
      expect(hideButton.prop('direction')).toEqual(directions.down);
    });

    it('ArrowButton should be enabled on select change', () => {
      const wrapper = create({
        visible: formattedProjects,
      });

      const select = wrapper.find(ProjectsSelect);

      let hideButton = wrapper.find(ArrowButton).at(1);
      expect(hideButton.prop('disabled')).toBeTruthy();

      select.simulate('change', { target: { options: selectedOptions } });

      hideButton = wrapper.find(ArrowButton).at(1);
      expect(hideButton.prop('disabled')).toBeFalsy();
    });

    it('should call property showProjects on button click', () => {
      const moveProjectsDown = jest.fn();
      const wrapper = create({
        visible: formattedProjects,
        moveProjectsDown,
      });

      const select = wrapper.find(ProjectsSelect);
      select.simulate('change', { target: { options: selectedOptions } });

      const hideButton = wrapper.find(ArrowButton).at(1);
      hideButton.simulate('click');

      expect(moveProjectsDown).toBeCalled();
      expect(moveProjectsDown.mock.calls[0][0]).toEqual(['ApacheAnt', 'Hibernate']);
    });
  });

  describe('hide button', () => {
    it('should has .configure-projects__control with modifiers classes', () => {
      const wrapper = create({});
      const selector = '.configure-projects__control.configure-projects__control_top.configure-projects__control_center';
      expect(wrapper.find(selector).length).toBe(1);
    });

    it('should render ArrowButton', () => {
      const wrapper = create({});
      const hideButton = wrapper.find(ArrowButton).at(2);
      expect(hideButton.prop('direction')).toEqual(directions.right);
    });

    it('ArrowButton should be enabled on select change', () => {
      const wrapper = create({
        visible: formattedProjects,
      });

      const select = wrapper.find(ProjectsSelect);

      let hideButton = wrapper.find(ArrowButton).at(2);
      expect(hideButton.prop('disabled')).toBeTruthy();

      select.simulate('change', { target: { options: selectedOptions } });

      hideButton = wrapper.find(ArrowButton).at(2);
      expect(hideButton.prop('disabled')).toBeFalsy();
    });

    it('should call property showProjects on button click', () => {
      const hideProjects = jest.fn();
      const wrapper = create({
        visible: formattedProjects,
        hideProjects,
      });

      const select = wrapper.find(ProjectsSelect);
      select.simulate('change', { target: { options: selectedOptions } });

      const hideButton = wrapper.find(ArrowButton).at(2);
      hideButton.simulate('click');

      expect(hideProjects).toBeCalled();
      expect(hideProjects.mock.calls[0][0]).toEqual(['ApacheAnt', 'Hibernate', 'Hibernate_HibernateOrm']);
      expect(wrapper.state('anyVisibleSelected')).toBeFalsy();
    });
  });
});
