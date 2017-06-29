import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { isIE } from '../../../utils/browserDetectUtils';

function ProjectsSelectOption(props) {
  const { id, name, depth, disabled, parentCustomSort, filterMatch } = props;

  const iePadding = isIE() && '\u00a0'.repeat(depth * 4);

  const classNames = cn(
    'projects-select__item',
    `projects-select__item_depth_${depth}`,
    parentCustomSort && 'projects-select__item_custom-sort',
    filterMatch && 'projects-select__item_filter-match',
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
