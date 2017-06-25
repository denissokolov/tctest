import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import formattedProjects from '../../../__mocks__/formattedProjects';
import ProjectsSelect, { types as projectsSelectTypes } from './ProjectsSelect';

function create({ items = [] }) {
  return shallow(
    <ProjectsSelect
      items={fromJS(items)}
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
    expect(wrapper.find('.projects-select__item').length).toBe(0);
  });

  it('should render all items with correct depths', () => {
    const wrapper = create({ items: formattedProjects });
    expect(wrapper.find('.projects-select__item').length).toBe(formattedProjects.length);

    wrapper.find('.projects-select__item').forEach((node, index) => {
      expect(node.hasClass(`projects-select__item_depth_${formattedProjects[index].depth}`)).toBeTruthy();
    });
  });
});
