import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import './projects-select-option.scss';

class ProjectsSelectOption extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    depth: PropTypes.number.isRequired,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    parentCustomSort: PropTypes.bool,
    filterMatch: PropTypes.bool,
    onMouseDown: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selected: false,
    disabled: false,
    parentCustomSort: false,
    filterMatch: false,
  };

  onMouseDown = (event) => {
    const { onMouseDown, id, disabled, index } = this.props;

    if (!disabled) {
      onMouseDown(id, index, event);
    }
  };

  onMouseEnter = (event) => {
    const { onMouseEnter, id, disabled, index } = this.props;

    if (!disabled) {
      onMouseEnter(id, index, event);
    }
  };

  render() {
    const { index, name, depth, selected, disabled, parentCustomSort, filterMatch } = this.props;

    const classNames = cn(
      'projects-select-option',
      `projects-select-option_depth_${depth}`,
      selected && 'projects-select-option_selected',
      disabled && 'projects-select-option_disabled',
      parentCustomSort && 'projects-select-option_custom-sort',
      filterMatch && 'projects-select-option_filter-match',
      index % 2 === 0 && 'projects-select-option_even',
    );

    return (
      // No need focus for select options. There is keyboard support in ProjectSelect component.
      // eslint-disable-next-line jsx-a11y/interactive-supports-focus
      <div
        className={classNames}
        title={name}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        role="option"
        aria-selected={selected}
      >
        {name}
      </div>
    );
  }
}

export default ProjectsSelectOption;
