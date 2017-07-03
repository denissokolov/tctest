import React from 'react';
import { shallow } from 'enzyme';

import FilterProjects from './FilterProjects';

function create({ value = '', onChange = jest.fn() }) {
  return shallow(
    <FilterProjects
      value={value}
      onChange={onChange}
    />,
  );
}

describe('FilterProjects', () => {
  it('should has .configure-projects__filter class', () => {
    const wrapper = create({});
    expect(wrapper.find('.configure-projects__filter').length).toBe(1);
  });

  it('input type property should be equal text', () => {
    const wrapper = create({});
    expect(wrapper.prop('type')).toEqual('text');
  });

  it('input placeholder property should be equal "filter projects"', () => {
    const wrapper = create({});
    expect(wrapper.prop('placeholder')).toEqual('filter projects');
  });

  it('input value property should be equal element value property', () => {
    const wrapper = create({ value: 'TTTEST' });
    expect(wrapper.prop('value')).toEqual('TTTEST');
  });

  it('should call onChange', () => {
    const onChange = jest.fn();
    const wrapper = create({ onChange });

    wrapper.simulate('change');

    expect(onChange).toBeCalled();
  });
});
