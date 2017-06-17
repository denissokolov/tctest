import React from 'react';
import { shallow } from 'enzyme';

import Layout from './Layout';

describe('Layout', () => {
  it('should has .layout class', () => {
    const wrapper = shallow(<Layout />);
    expect(wrapper.find('.layout').length).toBe(1);
  });
});
