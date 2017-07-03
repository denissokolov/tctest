import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import './projects-select-option.scss';

function ProjectsSelectOption(props) {
  const { id, name, depth, disabled, parentCustomSort, filterMatch, browserIsIE } = props;

  const iePadding = browserIsIE && '\u00a0'.repeat(depth * 4);

  const classNames = cn(
    'projects-select-option',
    `projects-select-option_depth_${depth}`,
    parentCustomSort && 'projects-select-option_custom-sort',
    filterMatch && 'projects-select-option_filter-match',
  );

  return (
    <option
      className={classNames}
      value={id}
      disabled={disabled}
      title={name}
    >
      {iePadding}{name}
    </option>
  );
}

ProjectsSelectOption.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  depth: PropTypes.number.isRequired,
  browserIsIE: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  parentCustomSort: PropTypes.bool,
  filterMatch: PropTypes.bool,
};

ProjectsSelectOption.defaultProps = {
  disabled: false,
  parentCustomSort: false,
  filterMatch: false,
};

export default ProjectsSelectOption;
