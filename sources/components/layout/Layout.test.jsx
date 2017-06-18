import React from 'react';
import { shallow } from 'enzyme';

import Layout from './Layout';
import ConnectedConfigureProjects from '../configure-projects/ConfigureProjects';
import Popup from '../popup/Popup';

describe('Layout', () => {
  it('should has .layout class', () => {
    const wrapper = shallow(<Layout />);
    expect(wrapper.find('.layout').length).toBe(1);
  });

  it('should render ConfigureProjects', () => {
    const wrapper = shallow(<Layout />);
    expect(wrapper.find(ConnectedConfigureProjects).length).toBe(1);
  });

  it('ConfigureProjects popup should be hidden', () => {
    const wrapper = shallow(<Layout />);
    expect(wrapper.find(Popup).prop('visible')).toBeFalsy();
  });

  it('click on ConfigureProjects link should make popup visible', () => {
    const wrapper = shallow(<Layout />);

    const preventDefault = jest.fn();
    wrapper.find('.layout__configure-projects-link').simulate('click', { preventDefault });

    expect(wrapper.find(Popup).prop('visible')).toBeTruthy();
    expect(preventDefault).toBeCalled();
  });

  it('calling Popup onClose should make popup hidden', () => {
    const wrapper = shallow(<Layout />);

    const preventDefault = jest.fn();
    wrapper.find('.layout__configure-projects-link').simulate('click', { preventDefault });

    wrapper.find(Popup).prop('onClose')();

    expect(wrapper.find(Popup).prop('visible')).toBeFalsy();
  });
});
