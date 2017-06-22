import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import ProjectSelectItem from './ProjectSelectItem';

import './projects-select.scss';

function ProjectsSelect({ items, onChange, disableVisibleItems = false, showOriginalData = false }) {
  return (
    <select
      className="projects-select"
      onChange={onChange}
      multiple
    >
      {items.map(item => (
        <ProjectSelectItem
          key={item.get('id')}
          item={item}
          disabled={disableVisibleItems && item.get('visible')}
          showOriginalData={showOriginalData}
          className={
            cn('projects-select__item', `projects-select__item_depth_${showOriginalData ? item.get('originalDepth') : item.get('depth')}`)
          }
        />
      ))}
    </select>
  );
}

ProjectsSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  disableVisibleItems: PropTypes.bool,
  showOriginalData: PropTypes.bool,
};

export default ProjectsSelect;

