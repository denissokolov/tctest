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
    selectedIds: new Set(),
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
      this.setState(state => this.setNextState(state, {
        savedSelectedIds: state.selectedIds,
        activeSelectStartIndex: index,
        activeSelectEndIndex: index,
        currentActionIsDeselect: state.selectedIds.has(id),
      }));
    } else if (event.shiftKey) {
      this.setState(state => this.setNextState(state, {
        savedSelectedIds: new Set(),
        activeSelectStartIndex:
          state.activeSelectStartIndex !== null ? state.activeSelectStartIndex : index,
        activeSelectEndIndex: index,
        currentActionIsDeselect: false,
      }));
    } else {
      this.setState(state => this.setNextState(state, {
        savedSelectedIds: new Set(),
        activeSelectStartIndex: index,
        activeSelectEndIndex: index,
        currentActionIsDeselect: false,
      }));
    }
  };

  onItemMouseEnter = (id, index) => {
    if (this.mouseDown) {
      this.setState(state => this.setNextState(state, {
        activeSelectEndIndex: index,
      }));
    }
  };

  onGlobalMouseUp = () => {
    if (this.mouseDown) {
      this.mouseDown = false;
    }
  };

  onKeyDown = (event) => {
    const itemsCount = this.props.items.length;
    if (itemsCount === 0) {
      return;
    }

    switch (event.keyCode) {
      case keyCodes.downArrow:
        event.preventDefault();
        this.handleDownButton(event.shiftKey, itemsCount);
        break;

      case keyCodes.upArrow:
        event.preventDefault();
        this.handleUpButton(event.shiftKey, itemsCount);
        break;

      case keyCodes.a:
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();

          this.setState(state => this.setNextState(state, {
            savedSelectedIds: state.selectedIds,
            activeSelectStartIndex: 0,
            activeSelectEndIndex: itemsCount - 1,
            currentActionIsDeselect: false,
          }));
        }
        break;

      default:
        break;
    }
  };

  setNextState(state, nextState) {
    const stateMerged = Object.assign({}, state, nextState);
    stateMerged.selectedIds = this.getActiveSelectedIds(stateMerged);
    return stateMerged;
  }

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

  handleDownButton(shiftPressed, itemsCount) {
    this.setState((state) => {
      let startIndex;
      let endIndex;

      if (state.activeSelectStartIndex === null) {
        endIndex = 0;
        startIndex = endIndex;
      } else {
        endIndex = state.activeSelectEndIndex === (itemsCount - 1)
          ? state.activeSelectEndIndex : (state.activeSelectEndIndex + 1);

        if (shiftPressed) {
          startIndex = state.activeSelectStartIndex;
        } else {
          startIndex = endIndex;
        }
      }

      return this.setNextState(state, {
        activeSelectStartIndex: startIndex,
        activeSelectEndIndex: endIndex,
        currentActionIsDeselect: false,
        savedSelectedIds: shiftPressed ? state.savedSelectedIds : new Set(),
      });
    });
  }

  handleUpButton(shiftPressed, itemsCount) {
    this.setState((state) => {
      let startIndex;
      let endIndex;

      if (state.activeSelectStartIndex === null) {
        endIndex = itemsCount - 1;
        startIndex = endIndex;
      } else {
        endIndex = state.activeSelectEndIndex === 0 ? 0 : (state.activeSelectEndIndex - 1);

        if (shiftPressed) {
          startIndex = state.activeSelectStartIndex;
        } else {
          startIndex = endIndex;
        }
      }

      return this.setNextState(state, {
        activeSelectStartIndex: startIndex,
        activeSelectEndIndex: endIndex,
        currentActionIsDeselect: false,
        savedSelectedIds: shiftPressed ? state.savedSelectedIds : new Set(),
      });
    });
  }

  mouseDown = false;

  render() {
    const { items } = this.props;
    const { selectedIds } = this.state;

    return (
      <div
        className="projects-select"
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        ref={(el) => { this.selectEl = el; }}
        role="listbox"
        tabIndex={0}
      >
        {items.map((item, index) => (
          <ProjectsSelectOption
            key={item.id}
            id={item.id}
            index={index}
            name={item.name}
            depth={item.depth}
            parentCustomSort={item.parentCustomSort}
            disabled={item.noInteractive}
            filterMatch={item.filterMatch}
            selected={selectedIds.has(item.id)}
            onMouseDown={this.onItemMouseDown}
            onMouseEnter={this.onItemMouseEnter}
          />
        ))}
      </div>
    );
  }
}

export default ProjectsSelect;
