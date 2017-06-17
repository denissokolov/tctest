import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

function VisibleProjects({ items }) {
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

VisibleProjects.propTypes = {
  items: PropTypes.instanceOf(List).isRequired,
};

export default VisibleProjects;

