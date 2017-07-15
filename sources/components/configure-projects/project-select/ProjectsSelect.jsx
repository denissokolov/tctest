/* globals document */

import React from 'react';
import PropTypes from 'prop-types';
import { Set } from 'immutable';

import ProjectsSelectOption from './ProjectsSelectOption';
import './projects-select.scss';

class ProjectsSelect extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  state = {
    selectedIds: new Set(),
    currentSelectedFirstIndex: null,
    currentSelectedLastIndex: null,
    currentActionIsRemove: false,
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.onGlobalMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onGlobalMouseUp);
  }

  onFocus = () => {
    this.focused = true;
  };

  onBlur = () => {
    this.focused = false;
  };

  onItemMouseDown = (id, index, event) => {
    if (event.button === 0) {
      if (event.shiftKey) {
        this.handleShiftMouseDown(index);
      } else {
        const reset = !event.ctrlKey && !event.metaKey;
        this.handleMouseDown(index, id, reset);
      }
    }
  };

  onItemMouseEnter = (id, index) => {
    const mouseDownIndex = this.mouseDownIndex;
    if (mouseDownIndex !== null) {
      this.setState({
        currentSelectedFirstIndex: mouseDownIndex < index ? mouseDownIndex : index,
        currentSelectedLastIndex: mouseDownIndex > index ? mouseDownIndex : index,
      });
    }
  };

  onGlobalMouseUp = () => {
    if (this.mouseDownIndex !== null) {
      const { currentSelectedFirstIndex, currentSelectedLastIndex } = this.state;
      this.changeSelectedRange(currentSelectedFirstIndex, currentSelectedLastIndex);
      this.mouseDownIndex = null;
    }
  };

  handleShiftMouseDown(index) {
    let firstIndex;
    let lastIndex;

    const lastMouseDownIndex = this.lastMouseDownIndex;
    if (lastMouseDownIndex === null) {
      firstIndex = index;
      lastIndex = index;
    } else if (lastMouseDownIndex < index) {
      firstIndex = lastMouseDownIndex;
      lastIndex = index;
    } else {
      firstIndex = index;
      lastIndex = lastMouseDownIndex;
    }

    this.changeSelectedRange(firstIndex, lastIndex, true);
  }

  handleMouseDown(index, id, reset) {
    this.mouseDownIndex = index;
    this.lastMouseDownIndex = index;

    this.setState((state) => {
      const nextState = {
        currentSelectedFirstIndex: index,
        currentSelectedLastIndex: index,
      };

      if (reset) {
        nextState.selectedIds = new Set();
        nextState.currentActionIsRemove = false;
      } else {
        nextState.currentActionIsRemove = state.selectedIds.has(id);
      }

      return nextState;
    });
  }

  changeSelectedRange(firstIndex, lastIndex, reset = false) {
    const { items } = this.props;
    const ids = [];

    let index = firstIndex;
    while (index <= lastIndex) {
      ids.push(items[index].id);
      index += 1;
    }

    this.setState((state) => {
      let selectedIds;
      if (reset) {
        selectedIds = new Set(ids);
      } else if (state.currentActionIsRemove) {
        selectedIds = state.selectedIds.subtract(ids);
      } else {
        selectedIds = state.selectedIds.union(ids);
      }

      return {
        currentActionIsRemove: false,
        currentSelectedFirstIndex: null,
        currentSelectedLastIndex: null,
        selectedIds,
      };
    });
  }

  focused = false;
  mouseDownIndex = null;
  lastMouseDownIndex = null;

  render() {
    const { items } = this.props;
    const {
      selectedIds, currentSelectedFirstIndex, currentSelectedLastIndex, currentActionIsRemove,
    } = this.state;

    const isCurrentSelect = currentSelectedFirstIndex !== null && currentSelectedLastIndex !== null;

    return (
      <div
        className="projects-select"
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        ref={(el) => { this.selectEl = el; }}
        role="listbox"
        tabIndex={0}
      >
        {items.map((item, index) => {
          let selected;
          if (isCurrentSelect
            && index >= currentSelectedFirstIndex && index <= currentSelectedLastIndex) {
            selected = !currentActionIsRemove;
          } else {
            selected = selectedIds.has(item.id);
          }

          return (
            <ProjectsSelectOption
              key={item.id}
              id={item.id}
              index={index}
              name={item.name}
              depth={item.depth}
              parentCustomSort={item.parentCustomSort}
              disabled={item.noInteractive}
              filterMatch={item.filterMatch}
              selected={selected}
              onMouseDown={this.onItemMouseDown}
              onMouseEnter={this.onItemMouseEnter}
            />
          );
        })}
      </div>
    );
  }
}

export default ProjectsSelect;
