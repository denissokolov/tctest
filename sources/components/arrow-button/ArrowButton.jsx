import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import './arrow-button.scss';

export const directions = {
  left: 'left',
  right: 'right',
  up: 'up',
  down: 'down',
};

function ArrowButton({ direction, disabled, onClick }) {
  const classNames = cn(
    'arrow-button',
    disabled && 'arrow-button_disabled',
    `arrow-button_${direction}`,
  );

  return (
    <button
      className={classNames}
      type="button"
      onClick={onClick}
      disabled={disabled}
    />
  );
}

ArrowButton.propTypes = {
  direction: PropTypes.oneOf([
    directions.left, directions.right, directions.up, directions.down,
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ArrowButton.defaultProps = {
  disabled: false,
};

export default ArrowButton;
