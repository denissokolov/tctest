import React from 'react';
import { shallow } from 'enzyme';

import ProjectsSelectOption from './ProjectsSelectOption';

function create(options) {
  const {
    id = 'testId',
    index = 0,
    name = 'test',
    depth = 1,
    selected = false,
    disabled = false,
    parentCustomSort = false,
    filterMatch = false,
    onMouseDown = jest.fn(),
    onMouseEnter = jest.fn(),
  } = options;

  return shallow(
    <ProjectsSelectOption
      id={id}
      index={index}
      name={name}
      depth={depth}
      selected={selected}
      disabled={disabled}
      parentCustomSort={parentCustomSort}
      filterMatch={filterMatch}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    />,
  );
}

describe('ProjectsSelectOption', () => {
  it('should has .projects-select-option and depth classes', () => {
    const wrapper = create({ depth: 4 });
    expect(wrapper.find('.projects-select-option').length).toBe(1);
    expect(wrapper.find('.projects-select-option_depth_4').length).toBe(1);
  });

  it('should has .projects-select-option_custom-sort for property parentCustomSort=true', () => {
    const wrapper = create({ parentCustomSort: true });
    expect(wrapper.find('.projects-select-option_custom-sort').length).toBe(1);
  });

  it('should has .projects-select-option_custom-sort for property filterMatch=true', () => {
    const wrapper = create({ filterMatch: true });
    expect(wrapper.find('.projects-select-option_filter-match').length).toBe(1);
  });

  it('should be selected for property selected=true', () => {
    const wrapper = create({ selected: true });
    expect(wrapper.find('.projects-select-option_selected').length).toBe(1);
    expect(wrapper.props('aria-selected')).toBeTruthy();
  });

  it('should has .projects-select-option_disabled for property disabled=true', () => {
    const wrapper = create({ disabled: true });
    expect(wrapper.find('.projects-select-option_disabled').length).toBe(1);
  });

  it('title should be equal name property', () => {
    const wrapper = create({ name: 'Test Project' });
    expect(wrapper.prop('title')).toEqual('Test Project');
  });

  it('text should be equal name property', () => {
    const wrapper = create({ name: 'Test Project' });
    expect(wrapper.text()).toEqual('Test Project');
  });
});
