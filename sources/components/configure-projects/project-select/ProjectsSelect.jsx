/* globals document */

import React from 'react';
import PropTypes from 'prop-types';
import { Set as ImmutableSet } from 'immutable';

import ProjectsSelectOption from './ProjectsSelectOption';
import './projects-select.scss';

class ProjectsSelect extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  state = {
    selectedIds: new ImmutableSet(),
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
      this.mouseDownIndex = index;
      const reset = !event.ctrlKey && !event.metaKey;

      this.setState((state) => {
        const nextState = {
          currentSelectedFirstIndex: index,
          currentSelectedLastIndex: index,
        };

        if (reset) {
          nextState.selectedIds = new ImmutableSet();
          nextState.currentActionIsRemove = false;
        } else {
          nextState.currentActionIsRemove = state.selectedIds.has(id);
        }

        return nextState;
      });
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
      const { items } = this.props;
      const selectedIds = [];

      let index = this.state.currentSelectedFirstIndex;
      const last = this.state.currentSelectedLastIndex;
      while (index <= last) {
        selectedIds.push(items[index].id);
        index += 1;
      }

      this.setState(state => ({
        selectedIds: state.currentActionIsRemove
          ? state.selectedIds.subtract(selectedIds)
          : state.selectedIds.union(selectedIds),
      }));

      this.mouseDownIndex = null;
    }
  };

  focused = false;
  mouseDownIndex = null;

  render() {
    const { items } = this.props;
    const {
      selectedIds, currentSelectedFirstIndex, currentSelectedLastIndex, currentActionIsRemove,
    } = this.state;

    const isCurrentSelect = currentSelectedFirstIndex !== null && currentSelectedLastIndex !== null;

    return (
      <div
        className="projects-select"
        tabIndex={1}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        ref={(el) => { this.selectEl = el; }}
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
