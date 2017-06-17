import React from 'react';
import { shallow } from 'enzyme';

import Layout from './Layout';
import ConnectedConfigureProjects from '../configure-projects/ConfigureProjects';

describe('Layout', () => {
  const wrapper = shallow(<Layout />);

  it('should has .layout class', () => {
    expect(wrapper.find('.layout').length).toBe(1);
  });

  it('should render ConfigureProjects', () => {
    expect(wrapper.find(ConnectedConfigureProjects).length).toBe(1);
  });
});
