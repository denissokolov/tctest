import React from 'react';
import PropTypes from 'prop-types';
import FormButton, { types as formButtonTypes, modifiers as formButtonModifiers } from '../../form-button/FormButton';

import './configure-projects-buttons.scss';

function ConfigureProjectsButtons({ onCancelClick, customSort }) {
  return (
    <div className="configure-projects-buttons">
      <div className="configure-projects-buttons__button">
        <FormButton
          text="Save"
          type={formButtonTypes.submit}
          modifier={formButtonModifiers.primary}
        />
      </div>

      <div className="configure-projects-buttons__button">
        <FormButton
          text="Cancel"
          onClick={onCancelClick}
        />
      </div>

      {customSort &&
        <div className="configure-projects-buttons__sort-message">
          Some projects are reordered (underlined)
        </div>
      }
    </div>
  );
}

ConfigureProjectsButtons.propTypes = {
  onCancelClick: PropTypes.func.isRequired,
  customSort: PropTypes.bool,
};

ConfigureProjectsButtons.defaultProps = {
  customSort: false,
};

export default ConfigureProjectsButtons;
