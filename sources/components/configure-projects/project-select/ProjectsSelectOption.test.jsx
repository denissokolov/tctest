import React from 'react';
import { shallow } from 'enzyme';

import ProjectsSelectOption from './ProjectsSelectOption';

function create(options) {
  const {
    id = 'testId',
    name = 'test',
    depth = 1,
    disabled = false,
    parentCustomSort = false,
    filterMatch = false,
    browserIsIE = false,
  } = options;

  return shallow(
    <ProjectsSelectOption
      id={id}
      name={name}
      depth={depth}
      disabled={disabled}
      parentCustomSort={parentCustomSort}
      filterMatch={filterMatch}
      browserIsIE={browserIsIE}
    />,
  );
}

describe('ProjectsSelectOption', () => {
  it('should has .projects-select-option and depth classes', () => {
    const wrapper = create({ depth: 4 });
    expect(wrapper.find('.projects-select-option').length).toBe(1);
    expect(wrapper.find('.projects-select-option_depth_4').length).toBe(1);
  });

  it('should insert non-breaking space before name for property browserIsIE=true', () => {
    const wrapper = create({ browserIsIE: true, depth: 2, name: 'Test Project', id: 'TESTID' });
    const ecpected = '<option class="projects-select-option projects-select-option_depth_2" value="TESTID" title="Test Project">\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0Test Project</option>';
    expect(wrapper.html()).toEqual(ecpected);
  });

  it('should has .projects-select-option_custom-sort for property parentCustomSort=true', () => {
    const wrapper = create({ parentCustomSort: true });
    expect(wrapper.find('.projects-select-option_custom-sort').length).toBe(1);
  });

  it('should has .projects-select-option_custom-sort for property parentCustomSort=true', () => {
    const wrapper = create({ filterMatch: true });
    expect(wrapper.find('.projects-select-option_filter-match').length).toBe(1);
  });

  it('value should be equal id property', () => {
    const wrapper = create({ id: 'TESTID' });
    expect(wrapper.prop('value')).toEqual('TESTID');
  });

  it('disabled should be equal disabled property', () => {
    const wrapper = create({ disabled: true });
    expect(wrapper.prop('disabled')).toBeTruthy();
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
