// TODO: extract option to component with SCU
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { List } from 'immutable';

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

  shouldComponentUpdate(nextProps) {
    return !(this.props.formVisible && !nextProps.formVisible);
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
        {items.map((item) => {
          let filterClassName;

          if (filterActive) {
            if (item.get('filterMatch')) {
              filterClassName = 'projects-select__item_filter-match';
            } else if (!item.get('filterTreeMatch')) {
              return null;
            }
          }

          const classNames = cn(
            'projects-select__item',
            `projects-select__item_depth_${type === types.hidden ? item.get('original').get('depth') : item.get('depth')}`,
            type === types.visible && item.get('parentCustomSort') && 'projects-select__item_custom-sort',
            filterClassName,
          );

          const name = type === types.hidden ? item.get('original').get('name') : item.get('name');

          return (
            <option
              key={item.get('id')}
              className={classNames}
              value={item.get('id')}
              disabled={type === types.hidden && item.get('visible')}
              title={name}
            >
              {item.get('sortKey')} = {name}
            </option>
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
