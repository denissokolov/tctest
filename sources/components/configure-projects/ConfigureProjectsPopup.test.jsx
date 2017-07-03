import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import { ConfigureProjectsPopup } from './ConfigureProjectsPopup';
import ConfigureProjects from './ConfigureProjects';
import Popup from '../popup/Popup';

jest.mock('../../actions/ConfigureProjectsActions');

function create(props) {
  const {
    configureProjects = { visible: [], hidden: [], hiddenFilterValue: '', error: null },
    dispatch = jest.fn(),
    onClose = jest.fn(),
    visible = true,
  } = props;

  return shallow(
    <ConfigureProjectsPopup
      configureProjects={fromJS(configureProjects)}
      dispatch={dispatch}
      onClose={onClose}
      visible={visible}
    />,
  );
}

describe('ConfigureProjectsHiddenSection', () => {
  it('should render popup with error message for configureProjects.error=true', () => {
    const wrapper = create({ configureProjects: { error: 'Error!' } });
    expect(wrapper.find(Popup).length).toBe(1);
    expect(wrapper.find('.popup-message_error').length).toBe(1);
    expect(wrapper.find('.popup-message_error').text()).toEqual('Error!');
  });

  it('should render popup with loading message for configureProjects.loading=true', () => {
    const wrapper = create({ configureProjects: { loading: true } });
    expect(wrapper.find(Popup).length).toBe(1);
    expect(wrapper.find('.popup-message_loading').length).toBe(1);
    expect(wrapper.find('.popup-message_loading').text()).toEqual('Loading');
  });

  it('should render popup', () => {
    const wrapper = create({ visible: false });
    expect(wrapper.find(Popup).length).toBe(1);
    expect(wrapper.find(Popup).prop('title')).toBe('Configure visible projects');
    expect(wrapper.find(ConfigureProjects).prop('visible')).toBeFalsy();
  });

  describe('ConfigureProjects', () => {
    it('should render', () => {
      const wrapper = create({ visible: false });
      expect(wrapper.find(ConfigureProjects).length).toBe(1);
      expect(wrapper.find(ConfigureProjects).prop('formVisible')).toBeFalsy();
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
