import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { List } from 'immutable';

import './projects-select.scss';

function ProjectsSelect({ items, onChange, disableVisibleItems, showOriginalData }) {
  return (
    <select
      className="projects-select"
      onChange={onChange}
      multiple
    >
      {items.map((item) => {
        const classNames = cn(
          'projects-select__item',
          `projects-select__item_depth_${showOriginalData ? item.get('originalDepth') : item.get('depth')}`);

        return (
          <option
            key={item.get('id')}
            className={classNames}
            value={item.get('id')}
            disabled={disableVisibleItems && item.get('visible')}
          >
            {showOriginalData ? item.get('originalName') : item.get('name')}
          </option>
        );
      })}
    </select>
  );
}

ProjectsSelect.propTypes = {
  items: PropTypes.instanceOf(List).isRequired,
  onChange: PropTypes.func.isRequired,
  disableVisibleItems: PropTypes.bool,
  showOriginalData: PropTypes.bool,
};

ProjectsSelect.defaultProps = {
  disableVisibleItems: false,
  showOriginalData: false,
};

export default ProjectsSelect;

