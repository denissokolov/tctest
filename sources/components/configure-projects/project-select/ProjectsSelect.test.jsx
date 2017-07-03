import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import formattedProjects from '../../../__mocks__/formattedProjects';
import ProjectsSelect, { types } from './ProjectsSelect';
import ProjectsSelectOption from './ProjectsSelectOption';

function create(props) {
  const {
    items = [],
    onChange = jest.fn(),
    type = types.visible,
    filterActive = false,
  } = props;

  return shallow(
    <ProjectsSelect
      items={fromJS(items)}
      formVisible
      onChange={onChange}
      type={type}
      filterActive={filterActive}
    />,
  );
}

describe('Projects', () => {
  it('should has .projects-select class', () => {
    const wrapper = create({});
    expect(wrapper.find('.projects-select').length).toBe(1);
  });

  it('should has multiple property', () => {
    const wrapper = create({});
    expect(wrapper.prop('multiple')).toBeTruthy();
  });

  it('should call onChange on option selected', () => {
    const onChange = jest.fn();
    const wrapper = create({ items: formattedProjects, onChange });

    wrapper.find('select').simulate('change');

    expect(onChange).toBeCalled();
  });

  it('should no render items for empty list', () => {
    const wrapper = create({});
    expect(wrapper.find(ProjectsSelectOption).length).toBe(0);
  });

  it('should render all items', () => {
    const wrapper = create({ items: formattedProjects });
    expect(wrapper.find(ProjectsSelectOption).length).toBe(formattedProjects.length);
  });

  it('should render only matched items for property filterActive=true', () => {
    const wrapper = create({ items: formattedProjects, filterActive: true });

    const matchedItems = formattedProjects.filter(item => item.filterMatch || item.filterTreeMatch);

    expect(wrapper.find(ProjectsSelectOption).length).toBe(matchedItems.length);
  });

  it('should set option properties for visible select type', () => {
    const item = {
      id: 'OpenSourceProjects',
      name: '<Root project> :: Open-source projects',
      depth: 1,
      parentProjectId: '_Root',
      filterTreeMatch: true,
      parentCustomSort: true,
      filterMatch: true,
      visible: true,
      original: {
        name: 'Open-source projects',
        depth: 2,
      },
    };

    const wrapper = create({ type: types.visible, items: [item], filterActive: true });
    const option = wrapper.find(ProjectsSelectOption).first();

    expect(option.prop('id')).toEqual(item.id);
    expect(option.prop('name')).toEqual(item.name);
    expect(option.prop('depth')).toEqual(item.depth);
    expect(option.prop('parentCustomSort')).toEqual(item.parentCustomSort);
    expect(option.prop('disabled')).toBeFalsy();
    expect(option.prop('filterMatch')).toEqual(item.filterMatch);
  });

  it('should set option properties for hidden select type', () => {
    const item = {
      id: 'OpenSourceProjects',
      name: '<Root project> :: Open-source projects',
      depth: 1,
      parentProjectId: '_Root',
      filterTreeMatch: true,
      parentCustomSort: true,
      filterMatch: true,
      visible: true,
      original: {
        name: 'Open-source projects',
        depth: 2,
      },
    };

    const wrapper = create({ type: types.hidden, items: [item], filterActive: true });
    const option = wrapper.find(ProjectsSelectOption).first();

    expect(option.prop('id')).toEqual(item.id);
    expect(option.prop('name')).toEqual(item.original.name);
    expect(option.prop('depth')).toEqual(item.original.depth);
    expect(option.prop('parentCustomSort')).toBeFalsy();
    expect(option.prop('disabled')).toEqual(item.visible);
    expect(option.prop('filterMatch')).toEqual(item.filterMatch);
  });
});
