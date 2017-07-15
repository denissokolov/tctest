/* globals document */

import React from 'react';
import PropTypes from 'prop-types';
import { Set } from 'immutable';

import keyCodes from '../../../utils/keyCodes';
import ProjectsSelectOption from './ProjectsSelectOption';
import './projects-select.scss';

class ProjectsSelect extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  state = {
    savedSelectedIds: new Set(),
    activeSelectStartIndex: null,
    activeSelectEndIndex: null,
    currentActionIsDeselect: false,
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.onGlobalMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onGlobalMouseUp);
  }

  onItemMouseDown = (id, index, event) => {
    this.mouseDown = true;

    if (event.ctrlKey || event.metaKey) {
      this.setState((state) => {
        const selectedIds = this.getActiveSelectedIds(state);
        const currentId = this.props.items[index].id;

        return {
          savedSelectedIds: selectedIds,
          activeSelectStartIndex: index,
          activeSelectEndIndex: index,
          currentActionIsDeselect: selectedIds.has(currentId),
        };
      });
    } else if (event.shiftKey) {
      this.setState(state => ({
        savedSelectedIds: new Set(),
        activeSelectStartIndex:
          state.activeSelectStartIndex !== null ? state.activeSelectStartIndex : index,
        activeSelectEndIndex: index,
      }));
    } else {
      this.setState({
        savedSelectedIds: new Set(),
        activeSelectStartIndex: index,
        activeSelectEndIndex: index,
      });
    }
  };

  onItemMouseEnter = (id, index) => {
    if (this.mouseDown) {
      this.setState({ activeSelectEndIndex: index });
    }
  };

  onGlobalMouseUp = () => {
    if (this.mouseDown) {
      this.mouseDown = false;
    }
  };

  onKeyDown = (event) => {
    if (!this.props.items.length) {
      return;
    }

    switch (event.keyCode) {
      case keyCodes.downArrow: {
        event.preventDefault();

        break;
      }

      case keyCodes.upArrow: {
        event.preventDefault();

        break;
      }

      default:
        break;
    }
  };

  getActiveSelectedIds(state) {
    const { activeSelectStartIndex, activeSelectEndIndex } = state;
    if (activeSelectStartIndex === null || activeSelectEndIndex === null) {
      return new Set();
    }

    const { currentActionIsDeselect, savedSelectedIds } = state;
    const { items } = this.props;
    const ids = [];

    const indexes = this.getSortedActiveSelectIndexes(activeSelectStartIndex, activeSelectEndIndex);

    let index = indexes.firstIndex;
    while (index <= indexes.lastIndex) {
      ids.push(items[index].id);
      index += 1;
    }

    return currentActionIsDeselect ? savedSelectedIds.subtract(ids) : savedSelectedIds.union(ids);
  }

  getSortedActiveSelectIndexes = (activeSelectStartIndex, activeSelectEndIndex) => (
    activeSelectStartIndex < activeSelectEndIndex ? {
      firstIndex: activeSelectStartIndex,
      lastIndex: activeSelectEndIndex,
    } : {
      firstIndex: activeSelectEndIndex,
      lastIndex: activeSelectStartIndex,
    }
  );

  mouseDown = false;

  render() {
    const { items } = this.props;
    const {
      savedSelectedIds, activeSelectStartIndex, activeSelectEndIndex, currentActionIsDeselect,
    } = this.state;

    const isCurrentSelect = activeSelectStartIndex !== null && activeSelectEndIndex !== null;
    const indexes = this.getSortedActiveSelectIndexes(activeSelectStartIndex, activeSelectEndIndex);

    return (
      <div
        className="projects-select"
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        ref={(el) => { this.selectEl = el; }}
        role="listbox"
        tabIndex={0}
      >
        {items.map((item, index) => {
          let selected;
          if (isCurrentSelect
            && index >= indexes.firstIndex && index <= indexes.lastIndex) {
            selected = !currentActionIsDeselect;
          } else {
            selected = savedSelectedIds.has(item.id);
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
