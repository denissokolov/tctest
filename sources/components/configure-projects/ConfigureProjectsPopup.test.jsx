import React from 'react';
import { shallow } from 'enzyme';

import { ConfigureProjectsPopup } from './ConfigureProjectsPopup';
import ConfigureProjects from './ConfigureProjects';
import Popup from '../popup/Popup';

jest.mock('../../actions/ConfigureProjectsActions');

function create(props) {
  const {
    error = undefined,
    loading = false,
    dispatch = jest.fn(),
    onClose = jest.fn(),
    visible = true,
  } = props;

  return shallow(
    <ConfigureProjectsPopup
      error={error}
      loading={loading}
      dispatch={dispatch}
      onClose={onClose}
      visible={visible}
    />,
  );
}

describe('ConfigureProjectsHiddenSection', () => {
  it('should render popup with error message for error=true', () => {
    const wrapper = create({ error: 'Error!' });
    expect(wrapper.find(Popup).length).toBe(1);
    expect(wrapper.find('.popup-message_error').length).toBe(1);
    expect(wrapper.find('.popup-message_error').text()).toEqual('Error!');
  });

  it('should render popup with loading message for loading=true', () => {
    const wrapper = create({ loading: true });
    expect(wrapper.find(Popup).length).toBe(1);
    expect(wrapper.find('.popup-message_loading').length).toBe(1);
    expect(wrapper.find('.popup-message_loading').text()).toEqual('Loading');
  });

  it('should render popup', () => {
    const wrapper = create({ visible: false });
    expect(wrapper.find(Popup).length).toBe(1);
    expect(wrapper.find(Popup).prop('title')).toBe('Configure visible projects');
    expect(wrapper.find(Popup).prop('visible')).toBeFalsy();
  });

  describe('ConfigureProjects', () => {
    it('should render for visible=false', () => {
      const wrapper = create({ visible: false });
      expect(wrapper.find(ConfigureProjects).length).toBe(0);
    });

    it('should render for visible=true', () => {
      const wrapper = create({ visible: true });
      expect(wrapper.find(ConfigureProjects).length).toBe(1);
    });

    it('should call property onClose on ConfigureProjects onSubmit called', () => {
      const onClose = jest.fn();
      const wrapper = create({ onClose });
      wrapper.find(ConfigureProjects).prop('onSubmit')();

      expect(onClose).toBeCalled();
    });

    it('should call property onCancel on ConfigureProjects onCancel called', () => {
      const onClose = jest.fn();
      const wrapper = create({ onClose });
      wrapper.find(ConfigureProjects).prop('onCancel')();

      expect(onClose).toBeCalled();
    });
  });
});
