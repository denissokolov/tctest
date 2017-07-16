import React from 'react';
import { shallow } from 'enzyme';

import formattedProjects from '../../../__mocks__/formattedProjects';
import ProjectsSelect from './ProjectsSelect';
import ProjectsSelectOption from './ProjectsSelectOption';

function create(props) {
  const {
    items = [],
    onChange = jest.fn(),
  } = props;

  return shallow(
    <ProjectsSelect
      items={items}
      formVisible
      onChange={onChange}
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

  it('should set option properties', () => {
    const item = {
      id: 'OpenSourceProjects',
      name: '<Root project> :: Open-source projects',
      depth: 1,
      parentCustomSort: true,
      filterMatch: true,
    };

    const wrapper = create({ items: [item] });
    const option = wrapper.find(ProjectsSelectOption).first();

    expect(option.prop('id')).toEqual(item.id);
    expect(option.prop('name')).toEqual(item.name);
    expect(option.prop('depth')).toEqual(item.depth);
    expect(option.prop('parentCustomSort')).toEqual(item.parentCustomSort);
    expect(option.prop('disabled')).toBeFalsy();
    expect(option.prop('filterMatch')).toEqual(item.filterMatch);
  });
});
