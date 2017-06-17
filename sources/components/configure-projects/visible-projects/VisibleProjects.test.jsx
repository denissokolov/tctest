import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import projects from '../../../__mocks__/projects';
import VisibleProjects from './VisibleProjects';

describe('VisibleProjects', () => {
  it('should no render li for empty list', () => {
    const wrapper = shallow(<VisibleProjects items={fromJS([])} />);
    expect(wrapper.find('li').length).toBe(0);
  });

  it('should render li count equal list size', () => {
    const wrapper = shallow(<VisibleProjects items={fromJS(projects)} />);
    expect(wrapper.find('li').length).toBe(projects.length);
  });
});
