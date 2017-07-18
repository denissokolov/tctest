import React from 'react';
import { shallow } from 'enzyme';

import { ShowButton } from './ShowButton';
import ArrowButton, { directions } from '../../arrow-button/ArrowButton';
import { showProjects } from '../../../actions/ConfigureProjectsActions';

function create({ disabled = false, dispatch = jest.fn() }) {
  return shallow(
    <ShowButton disabled={disabled} dispatch={dispatch} />,
  );
}

describe('ShowButton', () => {
  it('should render ArrowButton', () => {
    const wrapper = create({});
    const showButton = wrapper.find(ArrowButton);
    expect(showButton.prop('direction')).toEqual(directions.left);
  });

  it('ArrowButton should be disabled for property true', () => {
    const wrapper = create({ disabled: true });

    const showButton = wrapper.find(ArrowButton);
    expect(showButton.prop('disabled')).toBeTruthy();
  });

  it('should call dispatch showProjects on button click', () => {
    const dispatch = jest.fn();
    const wrapper = create({ dispatch });

    const showButton = wrapper.find(ArrowButton);
    showButton.simulate('click');

    expect(dispatch).toBeCalledWith(showProjects());
  });
});
