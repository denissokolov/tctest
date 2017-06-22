import React from 'react';
import PropTypes from 'prop-types';

function ProjectSelectItem({ className, item, disabled = false , showOriginalData = false }) {
  return (
    <option
      className={className}
      value={item.get('key')}
      disabled={disabled}
    >
      {showOriginalData ? item.get('originalName') : item.get('name')}
    </option>
  );
}

ProjectSelectItem.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default ProjectSelectItem;
