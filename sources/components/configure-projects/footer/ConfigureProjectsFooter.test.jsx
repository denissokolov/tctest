import React from 'react';
import { shallow } from 'enzyme';

import { ConfigureProjectsFooter } from './ConfigureProjectsFooter';
import FormButton from '../../form-button/FormButton';

function create({ customSort = false, onCancelClick = jest.fn() }) {
  return shallow(
    <ConfigureProjectsFooter
      customSort={customSort}
      onCancelClick={onCancelClick}
    />,
  );
}

describe('ConfigureProjectsFooter', () => {
  it('should has .configure-projects-footer class', () => {
    const wrapper = create({});
    expect(wrapper.find('.configure-projects-footer').length).toBe(1);
  });

  it('should no render sort message for property customSort=false', () => {
    const wrapper = create({ customSort: false });
    expect(wrapper.find('.configure-projects-footer__sort-message').length).toBe(0);
  });

  it('should render sort message for property customSort=true', () => {
    const wrapper = create({ customSort: true });
    expect(wrapper.find('.configure-projects-footer__sort-message').length).toBe(1);
  });

  it('should render save and cancel form buttons', () => {
    const wrapper = create({});
    expect(wrapper.find('.configure-projects-footer__button').length).toBe(2);

    const saveButton = wrapper.find(FormButton).first();
    expect(saveButton.prop('text')).toEqual('Save');
    expect(saveButton.prop('type')).toEqual('submit');
    expect(saveButton.prop('modifier')).toEqual('primary');

    const cancelButton = wrapper.find(FormButton).last();
    expect(cancelButton.prop('text')).toEqual('Cancel');
  });

  it('should call onCancelClick on cancel button click', () => {
    const onCancelClick = jest.fn();
    const wrapper = create({ onCancelClick });

    wrapper.find(FormButton).last().simulate('click');
    expect(onCancelClick).toBeCalled();
  });
});
