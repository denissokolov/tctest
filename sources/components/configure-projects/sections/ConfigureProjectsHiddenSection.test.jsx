import React from 'react';
import { shallow } from 'enzyme';

import formattedProjects from '../../../__mocks__/formattedProjects';
import ConfigureProjectsHiddenSection from './ConfigureProjectsHiddenSection';
import ProjectsSelect from '../project-select/ProjectsSelect';
import ArrowButton, { directions } from '../../arrow-button/ArrowButton';
import FilterProjects from '../filter/FilterProjects';

function create(props) {
  const {
    hidden = [],
    hiddenFilterValue = '',
    showProjects = jest.fn(),
    changeHiddenFilter = jest.fn(),
    formVisible = true,
  } = props;

  return shallow(
    <ConfigureProjectsHiddenSection
      hidden={hidden}
      hiddenFilterValue={hiddenFilterValue}
      showProjects={showProjects}
      changeHiddenFilter={changeHiddenFilter}
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

describe('ConfigureProjectsHiddenSection', () => {
  it('should has .configure-projects__section class', () => {
    const wrapper = create({});
    expect(wrapper.find('.configure-projects__section').length).toBe(1);
  });

  it('section title should exist', () => {
    const wrapper = create({});
    expect(wrapper.find('.configure-projects__section-title').length).toBe(1);
    expect(wrapper.find('.configure-projects__section-title').text()).toEqual('Hidden projects');
  });

  describe('FilterProjects', () => {
    it('should has value', () => {
      const wrapper = create({ hiddenFilterValue: 'filter test' });
      expect(wrapper.find(FilterProjects).prop('value')).toBe('filter test');
    });

    it('should call changeHiddenFilter property on change', () => {
      const changeHiddenFilter = jest.fn();
      const wrapper = create({ changeHiddenFilter });

      wrapper.find(FilterProjects).simulate('change', { target: { value: 'changed value' } });

      expect(changeHiddenFilter).toBeCalled();
      expect(changeHiddenFilter.mock.calls[0][0]).toEqual('changed value');
    });
  });

  describe('select', () => {
    it('should has .configure-projects__select class', () => {
      const wrapper = create({});
      expect(wrapper.find('.configure-projects__select').length).toBe(1);
    });

    it('should render ProjectsSelect', () => {
      const wrapper = create({
        hidden: formattedProjects,
        hiddenFilterValue: 'test',
        formVisible: false,
      });
      const select = wrapper.find(ProjectsSelect);

      expect(select.prop('filterActive')).toBeTruthy();
      expect(select.prop('formVisible')).toBeFalsy();
    });

    it('should set property anyHiddenSelected to state on ProjectsSelect change', () => {
      const wrapper = create({
        hidden: formattedProjects,
      });
      const select = wrapper.find(ProjectsSelect);

      expect(wrapper.state('anyHiddenSelected')).toBeFalsy();

      select.simulate('change', { target: { options: selectedOptions } });
      expect(wrapper.state('anyHiddenSelected')).toBeTruthy();

      select.simulate('change', { target: { options: selectedOptions } });
      expect(wrapper.state('anyHiddenSelected')).toBeTruthy();
    });
  });

  describe('show button', () => {
    it('should has .configure-projects__control with modifiers classes', () => {
      const wrapper = create({});
      const selector = '.configure-projects__control.configure-projects__control_bottom.configure-projects__control_center';
      expect(wrapper.find(selector).length).toBe(1);
    });

    it('should render ArrowButton', () => {
      const wrapper = create({});
      const showButton = wrapper.find(ArrowButton);
      expect(showButton.prop('direction')).toEqual(directions.left);
    });

    it('ArrowButton should be enabled on select change', () => {
      const wrapper = create({
        hidden: formattedProjects,
      });

      const select = wrapper.find(ProjectsSelect);

      let showButton = wrapper.find(ArrowButton);
      expect(showButton.prop('disabled')).toBeTruthy();

      select.simulate('change', { target: { options: selectedOptions } });

      showButton = wrapper.find(ArrowButton);
      expect(showButton.prop('disabled')).toBeFalsy();
    });

    it('should call property showProjects on button click', () => {
      const showProjects = jest.fn();
      const wrapper = create({
        hidden: formattedProjects,
        showProjects,
      });

      const select = wrapper.find(ProjectsSelect);
      select.simulate('change', { target: { options: selectedOptions } });

      const showButton = wrapper.find(ArrowButton);
      showButton.simulate('click');

      expect(showProjects).toBeCalled();
      expect(showProjects.mock.calls[0][0]).toEqual(['ApacheAnt', 'Hibernate', 'Hibernate_HibernateOrm']);
      expect(wrapper.state('anyHiddenSelected')).toBeFalsy();
    });
  });
});
