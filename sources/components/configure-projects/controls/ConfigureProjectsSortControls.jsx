import React from 'react';
import PropTypes from 'prop-types';

import ArrowButton, { directions as arrowButtonDiractions } from '../../arrow-button/ArrowButton';

function ConfigureProjectsSortControls(props) {
  const { isDisabled, onMoveUpClick, onMoveDownClick } = props;

  return (
    <div className="configure-projects__controls centered-block">
      <div className="centered-block__content">
        <span className="configure-projects__control">
          <ArrowButton
            direction={arrowButtonDiractions.up}
            onClick={onMoveUpClick}
            disabled={isDisabled}
          />
        </span>

        <span className="configure-projects__control">
          <ArrowButton
            direction={arrowButtonDiractions.down}
            onClick={onMoveDownClick}
            disabled={isDisabled}
          />
        </span>
      </div>
    </div>
  );
}

ConfigureProjectsSortControls.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  onMoveUpClick: PropTypes.func.isRequired,
  onMoveDownClick: PropTypes.func.isRequired,
};

export default ConfigureProjectsSortControls;
