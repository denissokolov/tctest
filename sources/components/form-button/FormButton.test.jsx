import React from 'react';
import { shallow } from 'enzyme';

import FormButton, { modifiers, types } from './FormButton';

function create({ text = '', modifier = modifiers.default, type = types.button, onClick = jest.fn() }) {
  return shallow(
    <FormButton
      text={text}
      modifier={modifier}
      type={type}
      onClick={onClick}
    />,
  );
}

describe('FormButton', () => {
  it('should has .form-button and modifier classes', () => {
    const wrapper = create({ modifier: modifiers.primary });
    expect(wrapper.find('.form-button').length).toBe(1);
    expect(wrapper.find('.form-button_primary').length).toBe(1);
  });

  it('should has submit type attr for property type=submit', () => {
    const wrapper = create({ type: types.submit });
    expect(wrapper.prop('type')).toEqual('submit');
  });

  it('should call onClick', () => {
    const onClick = jest.fn();
    const wrapper = create({ onClick });

    const preventDefault = jest.fn();
    wrapper.simulate('click', { preventDefault });

    expect(onClick).toBeCalled();
    expect(preventDefault).toBeCalled();
  });
});
