import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import ProjectsSelectOption from './ProjectsSelectOption';
import './projects-select.scss';

export const types = {
  visible: 'visible',
  hidden: 'hidden',
};

class ProjectsSelect extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.formVisible && !nextProps.formVisible) {
      if (this.selectEl && this.selectEl.scrollTo) {
        this.selectEl.scrollTo(0, 0);
      }
    }
  }

  render() {
    const { items, onChange, type, filterActive } = this.props;

    return (
      <select
        className="projects-select"
        onChange={onChange}
        multiple
        ref={(el) => { this.selectEl = el; }}
      >
        {items.toArray().map((item) => {
          if (filterActive && !item.get('filterTreeMatch') && !item.get('filterMatch')) {
            return null;
          }

          return (
            <ProjectsSelectOption
              key={item.get('id')}
              id={item.get('id')}
              name={type === types.hidden ? item.get('original').get('name') : item.get('name')}
              depth={type === types.hidden ? item.get('original').get('depth') : item.get('depth')}
              parentCustomSort={type === types.visible && item.get('parentCustomSort')}
              disabled={type === types.hidden && item.get('visible')}
              filterMatch={filterActive && item.get('filterMatch')}
            />
          );
        })}
      </select>
    );
  }
}

ProjectsSelect.propTypes = {
  type: PropTypes.oneOf([types.visible, types.hidden]).isRequired,
  items: PropTypes.instanceOf(List).isRequired,
  onChange: PropTypes.func.isRequired,
  formVisible: PropTypes.bool.isRequired,
  filterActive: PropTypes.bool,
};

ProjectsSelect.defaultProps = {
  filterActive: false,
};

export default ProjectsSelect;
