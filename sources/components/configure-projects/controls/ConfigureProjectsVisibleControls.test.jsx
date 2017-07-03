import React from 'react';
import { shallow } from 'enzyme';

import ConfigureProjectsVisibleControls from './ConfigureProjectsVisibleControls';
import ArrowButton, { directions } from '../../arrow-button/ArrowButton';

function create(props) {
  const {
    hideIsDisabled = false,
    showIsDisabled = false,
    onHideClick = jest.fn(),
    onShowClick = jest.fn(),
  } = props;

  return shallow(
    <ConfigureProjectsVisibleControls
      hideIsDisabled={hideIsDisabled}
      showIsDisabled={showIsDisabled}
      onHideClick={onHideClick}
      onShowClick={onShowClick}
    />,
  );
}

describe('ConfigureProjectsVisibleControls', () => {
  it('should has .configure-projects__controls and .centered-block classes', () => {
    const wrapper = create({});
    expect(wrapper.find('.configure-projects__controls').length).toBe(1);
    expect(wrapper.find('.centered-block').length).toBe(1);
  });

  it('should render hide and show buttons', () => {
    const wrapper = create({});
    expect(wrapper.find('.configure-projects__control').length).toBe(2);

    const hideButton = wrapper.find(ArrowButton).first();
    expect(hideButton.prop('direction')).toEqual(directions.right);
    expect(hideButton.prop('disabled')).toBeFalsy();

    const showButton = wrapper.find(ArrowButton).last();
    expect(showButton.prop('direction')).toEqual(directions.left);
    expect(showButton.prop('disabled')).toBeFalsy();
  });

  it('should render disabled hide button for element property hideIsDisabled=true', () => {
    const wrapper = create({ hideIsDisabled: true });

    const hideButton = wrapper.find(ArrowButton).first();
    expect(hideButton.prop('disabled')).toBeTruthy();
  });

  it('should render disabled show button for element property showIsDisabled=true', () => {
    const wrapper = create({ showIsDisabled: true });

    const showButton = wrapper.find(ArrowButton).last();
    expect(showButton.prop('disabled')).toBeTruthy();
  });

  it('should call onHideClick on hide button click', () => {
    const onHideClick = jest.fn();
    const wrapper = create({ onHideClick });

    wrapper.find(ArrowButton).first().simulate('click');
    expect(onHideClick).toBeCalled();
  });

  it('should call onShowClick on show button click', () => {
    const onShowClick = jest.fn();
    const wrapper = create({ onShowClick });

    wrapper.find(ArrowButton).last().simulate('click');
    expect(onShowClick).toBeCalled();
  });
});
