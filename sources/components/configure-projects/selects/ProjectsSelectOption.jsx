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
    actionText: PropTypes.string,
    actionOnClick: PropTypes.func,
    onMouseDown: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    selected: false,
    disabled: false,
    parentCustomSort: false,
    filterMatch: false,
    actionText: undefined,
    actionOnClick: undefined,
    style: {},
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

  onActionClick = (event) => {
    event.preventDefault();

    const { actionOnClick, id } = this.props;

    if (actionOnClick) {
      actionOnClick(id);
    }
  };

  onActionMouseDown = (event) => {
    event.stopPropagation();
  };

  render() {
    const {
      index, name, depth, selected, disabled, parentCustomSort, filterMatch, style, actionText,
    } = this.props;

    const classNames = cn(
      'projects-select-option',
      `projects-select-option_depth_${depth}`,
      selected && !disabled && 'projects-select-option_selected',
      disabled && 'projects-select-option_disabled',
      parentCustomSort && 'projects-select-option_custom-sort',
      filterMatch && 'projects-select-option_filter-match',
      index % 2 === 0 && 'projects-select-option_even',
    );

    return (
      // No need focus for select options. There is keyboard support in ProjectSelect component.
      // eslint-disable-next-line jsx-a11y/interactive-supports-focus
      <div
        role="option"
        className={classNames}
        title={name}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        aria-selected={selected}
        style={style}
      >
        {name}
        {actionText && !disabled && (
          // No need focus for action link. There is alternative keyboard shortcut for this.
          // eslint-disable-next-line jsx-a11y/interactive-supports-focus
          <a
            className="projects-select-option__move"
            role="button"
            onMouseDown={this.onActionMouseDown}
            onClick={this.onActionClick}
          >
            {actionText}
          </a>
        )}
      </div>
    );
  }
}

export default ProjectsSelectOption;
