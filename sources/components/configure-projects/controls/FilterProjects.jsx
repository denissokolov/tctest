import React from 'react';
import PropTypes from 'prop-types';

function FilterProjects({ onChange, value }) {
  return (
    <input
      type="text"
      onChange={onChange}
      className="configure-projects__filter"
      placeholder="filter projects"
      value={value}
    />
  );
}

FilterProjects.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default FilterProjects;
