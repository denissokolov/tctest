import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

function Projects({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.get('id')}>
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

