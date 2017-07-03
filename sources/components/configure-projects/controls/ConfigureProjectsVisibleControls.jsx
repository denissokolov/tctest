import React from 'react';
import PropTypes from 'prop-types';

import ArrowButton, { directions as arrowButtonDiractions } from '../../arrow-button/ArrowButton';

function ConfigureProjectsVisibleControls(props) {
  const { hideIsDisabled, showIsDisabled, onHideClick, onShowClick } = props;

  return (
    <div className="configure-projects__controls centered-block">
      <div className="centered-block__content">
        <div className="configure-projects__control">
          <ArrowButton
            direction={arrowButtonDiractions.right}
            onClick={onHideClick}
            disabled={hideIsDisabled}
          />
        </div>

        <div className="configure-projects__control">
          <ArrowButton
            direction={arrowButtonDiractions.left}
            onClick={onShowClick}
            disabled={showIsDisabled}
          />
        </div>
      </div>
    </div>
  );
}

ConfigureProjectsVisibleControls.propTypes = {
  hideIsDisabled: PropTypes.bool.isRequired,
  showIsDisabled: PropTypes.bool.isRequired,
  onHideClick: PropTypes.func.isRequired,
  onShowClick: PropTypes.func.isRequired,
};

export default ConfigureProjectsVisibleControls;
