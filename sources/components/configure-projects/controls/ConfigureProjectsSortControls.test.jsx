import React from 'react';
import { shallow } from 'enzyme';

import ConfigureProjectsSortControls from './ConfigureProjectsSortControls';
import ArrowButton, { directions } from '../../arrow-button/ArrowButton';

function create({ isDisabled = false, onMoveUpClick = jest.fn(), onMoveDownClick = jest.fn() }) {
  return shallow(
    <ConfigureProjectsSortControls
      isDisabled={isDisabled}
      onMoveUpClick={onMoveUpClick}
      onMoveDownClick={onMoveDownClick}
    />,
  );
}

describe('ConfigureProjectsSortControls', () => {
  it('should has .configure-projects__controls and .centered-block classes', () => {
    const wrapper = create({});
    expect(wrapper.find('.configure-projects__controls').length).toBe(1);
    expect(wrapper.find('.centered-block').length).toBe(1);
  });

  it('should render up and down buttons', () => {
    const wrapper = create({});
    expect(wrapper.find('.configure-projects__control').length).toBe(2);

    const upButton = wrapper.find(ArrowButton).first();
    expect(upButton.prop('direction')).toEqual(directions.up);
    expect(upButton.prop('disabled')).toBeFalsy();

    const downButton = wrapper.find(ArrowButton).last();
    expect(downButton.prop('direction')).toEqual(directions.down);
    expect(downButton.prop('disabled')).toBeFalsy();
  });

  it('should render disabled buttons for element property isDisabled=true', () => {
    const wrapper = create({ isDisabled: true });

    const upButton = wrapper.find(ArrowButton).first();
    expect(upButton.prop('disabled')).toBeTruthy();

    const downButton = wrapper.find(ArrowButton).last();
    expect(downButton.prop('disabled')).toBeTruthy();
  });

  it('should call onMoveUpClick on up button click', () => {
    const onMoveUpClick = jest.fn();
    const wrapper = create({ onMoveUpClick });

    wrapper.find(ArrowButton).first().simulate('click');
    expect(onMoveUpClick).toBeCalled();
  });

  it('should call onMoveUpClick on up button click', () => {
    const onMoveDownClick = jest.fn();
    const wrapper = create({ onMoveDownClick });

    wrapper.find(ArrowButton).last().simulate('click');
    expect(onMoveDownClick).toBeCalled();
  });
});
