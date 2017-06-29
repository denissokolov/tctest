import React from 'react';
import { shallow } from 'enzyme';

import Layout from './Layout';
import ConnectedConfigureProjectsPopup from '../configure-projects/ConfigureProjectsPopup';

describe('Layout', () => {
  it('should has .layout class', () => {
    const wrapper = shallow(<Layout />);
    expect(wrapper.find('.layout').length).toBe(1);
  });

  it('should render ConfigureProjectsPopup', () => {
    const wrapper = shallow(<Layout />);
    expect(wrapper.find(ConnectedConfigureProjectsPopup).length).toBe(1);
  });

  it('ConfigureProjectsPopup popup should be hidden', () => {
    const wrapper = shallow(<Layout />);
    expect(wrapper.find(ConnectedConfigureProjectsPopup).prop('visible')).toBeFalsy();
  });

  it('click on ConfigureProjects link should make popup visible', () => {
    const wrapper = shallow(<Layout />);

    const preventDefault = jest.fn();
    wrapper.find('.layout__configure-projects-link').simulate('click', { preventDefault });

    expect(wrapper.find(ConnectedConfigureProjectsPopup).prop('visible')).toBeTruthy();
    expect(preventDefault).toBeCalled();
  });

  it('calling ConfigureProjectsPopup onClose should make popup hidden', () => {
    const wrapper = shallow(<Layout />);

    const preventDefault = jest.fn();
    wrapper.find('.layout__configure-projects-link').simulate('click', { preventDefault });

    wrapper.find(ConnectedConfigureProjectsPopup).prop('onClose')();

    expect(wrapper.find(ConnectedConfigureProjectsPopup).prop('visible')).toBeFalsy();
  });
});
