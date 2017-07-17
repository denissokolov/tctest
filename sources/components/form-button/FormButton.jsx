import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import './form-button.scss';

export const types = {
  submit: 'submit',
  button: 'text',
};

export const modifiers = {
  primary: 'primary',
  default: 'default',
};

class FormButton extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf([types.submit, types.button]),
    modifier: PropTypes.oneOf([modifiers.default, modifiers.primary]),
    onClick: PropTypes.func,
  };

  static defaultProps = {
    type: types.button,
    modifier: modifiers.default,
    onClick: undefined,
  };

  onClick = (event) => {
    const { onClick } = this.props;

    if (onClick) {
      event.preventDefault();
      onClick();
    }
  };

  render() {
    const { type, text, modifier } = this.props;

    return (
      <button
        type={type}
        className={cn('form-button', `form-button_${modifier}`)}
        onClick={this.onClick}
      >
        {text}
      </button>
    );
  }
}

export default FormButton;
