import React from 'react';
import { shallow } from 'enzyme';

import ArrowButton, { directions } from './ArrowButton';

function create({ direction = directions.up, disabled = false, onClick = jest.fn() }) {
  return shallow(
    <ArrowButton
      direction={direction}
      disabled={disabled}
      onClick={onClick}
    />,
  );
}

describe('ArrowButton', () => {
  it('should has .arrow-button and direction classes', () => {
    const wrapper = create({ direction: directions.left });
    expect(wrapper.find('.arrow-button').length).toBe(1);
    expect(wrapper.find('.arrow-button_left').length).toBe(1);
  });

  it('should has disabled attr and class for property disabled=true', () => {
    const wrapper = create({ disabled: true });
    expect(wrapper.find('.arrow-button_disabled').length).toBe(1);
    expect(wrapper.prop('disabled')).toBeTruthy();
  });

  it('should call onClick', () => {
    const onClick = jest.fn();
    const wrapper = create({ onClick });
    wrapper.simulate('click');

    expect(onClick).toBeCalled();
  });
});
