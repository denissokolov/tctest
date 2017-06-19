import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import cn from 'classnames';

import './projects-select.scss';

function Projects({ items }) {
  return (
    <ul className="projects-select">
      {items.map(item => (
        <li
          key={item.get('id')}
          className={cn('projects-select__item', `projects-select__item_depth_${item.get('depth')}`)}
        >
          {item.get('name')}
        </li>
      ))}
    </ul>
  );
}

Projects.propTypes = {
  items: PropTypes.instanceOf(List).isRequired,
};

export default Projects;

