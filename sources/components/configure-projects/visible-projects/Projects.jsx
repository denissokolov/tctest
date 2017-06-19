import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import './projects.scss';

function Projects({ items }) {
  return (
    <ul className="projects">
      {items.map(item => (
        <li key={item.get('id')} className="projects__item">
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

