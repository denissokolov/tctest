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

function ArrowButton({ direction, title, disabled, onClick, tabIndex}) {
  const classNames = cn(
    'arrow-button',
    disabled && 'arrow-button_disabled',
    `arrow-button_${direction}`,
  );

  return (
    <button
      className={classNames}
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      tabIndex={tabIndex}
    />
  );
}

ArrowButton.propTypes = {
  direction: PropTypes.oneOf([
    directions.left, directions.right, directions.up, directions.down,
  ]).isRequired,
  title: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  tabIndex: PropTypes.number,
};

ArrowButton.defaultProps = {
  title: undefined,
  tabIndex: undefined,
  disabled: false,
};

export default ArrowButton;
