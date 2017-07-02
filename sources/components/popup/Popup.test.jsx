/* global document */

import React from 'react';
import { shallow } from 'enzyme';

import Popup from './Popup';

function create({ title = '', visible = false, children = <div />, onClose = jest.fn() }) {
  return shallow(
    <Popup
      title={title}
      visible={visible}
      onClose={onClose}
    >
      {children}
    </Popup>,
  );
}

describe('Popup', () => {
  it('should has .popup class', () => {
    const wrapper = create({});
    expect(wrapper.find('.popup').length).toBe(1);
  });

  it('should render children', () => {
    const children = <div id="test-children" />;
    const wrapper = create({ children });

    expect(wrapper.find('#test-children').length).toBe(1);
  });

  it('should render title', () => {
    const title = 'test title';
    const wrapper = create({ title });

    expect(wrapper.find('.popup__title').text()).toBe(title);
  });

  it('should not be visible with false param', () => {
    const wrapper = create({ visible: false });

    expect(wrapper.find('.popup_visible').length).toBe(0);
  });

  it('should be visible with true param', () => {
    const wrapper = create({ visible: true });

    expect(wrapper.find('.popup_visible').length).toBe(1);
  });

  it('should call onClose on close button click', () => {
    const onClose = jest.fn();
    const wrapper = create({ onClose });

    wrapper.find('.popup__close-button').simulate('click');

    expect(onClose).toBeCalled();
  });

  it('should not call onClose on fast shadow click', () => {
    const onClose = jest.fn();
    const wrapper = create({ onClose });
    wrapper.setProps({ visible: true });

    wrapper.find('.popup__shadow').simulate('click');

    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it('should call onClose on shadow click with delay', (done) => {
    const onClose = jest.fn();
    const wrapper = create({ onClose });

    wrapper.setProps({ visible: true });

    setTimeout(() => {
      wrapper.find('.popup__shadow').simulate('click');
      expect(onClose).toBeCalled();
      done();
    }, 300);
  });

  it('should not call document keydown event listener for invisible popup', () => {
    const onClose = jest.fn();

    const map = {};
    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });

    create({ onClose });

    expect(map.keydown).toBeUndefined();
  });

  it('should call onClose on ESC press for visible popup', () => {
    const onClose = jest.fn();

    const map = {};
    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });

    const wrapper = create({ onClose });
    wrapper.setProps({ visible: true });

    expect(map.keydown).not.toBeUndefined();

    map.keydown({ keyCode: 27 });

    expect(onClose).toBeCalled();
  });

  it('should remove document keydown event listener on unmount', () => {
    const onClose = jest.fn();

    let keyDownRemoved = false;
    document.removeEventListener = jest.fn((event) => {
      if (event === 'keydown') {
        keyDownRemoved = true;
      }
    });

    const wrapper = create({ onClose });
    wrapper.setProps({ visible: true });
    wrapper.unmount();

    expect(keyDownRemoved).toBeTruthy();
  });

  it('should remove document keydown event listener on close popup', () => {
    const onClose = jest.fn();

    let keyDownRemoved = false;
    document.removeEventListener = jest.fn((event) => {
      if (event === 'keydown') {
        keyDownRemoved = true;
      }
    });

    const wrapper = create({ onClose });
    wrapper.setProps({ visible: true });
    wrapper.setProps({ visible: false });

    expect(keyDownRemoved).toBeTruthy();
  });
});
