import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import formattedProjects from '../../../__mocks__/formattedProjects';
import ProjectsSelect, { types as projectsSelectTypes } from './ProjectsSelect';
import ProjectsSelectOption from './ProjectsSelectOption';

function create({ items = [] }) {
  return shallow(
    <ProjectsSelect
      items={fromJS(items)}
      formVisible
      onChange={jest.fn()}
      type={projectsSelectTypes.visible}
    />,
  );
}

describe('Projects', () => {
  it('should has .projects-select class', () => {
    const wrapper = create({});
    expect(wrapper.find('.projects-select').length).toBe(1);
  });

  it('should no render items for empty list', () => {
    const wrapper = create({});
    expect(wrapper.find(ProjectsSelectOption).length).toBe(0);
  });

  it('should render all items', () => {
    const wrapper = create({ items: formattedProjects });
    expect(wrapper.find(ProjectsSelectOption).length).toBe(formattedProjects.length);
  });
});
