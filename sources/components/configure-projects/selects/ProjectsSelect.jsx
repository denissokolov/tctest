/* globals document */

import React from 'react';
import PropTypes from 'prop-types';
import { Set } from 'immutable';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';

import keyCodes from '../../../utils/keyCodes';
import ProjectsSelectOption from './ProjectsSelectOption';
import './projects-select.scss';

const OPTION_HEIGHT = 26;

class ProjectsSelect extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedIds: PropTypes.instanceOf(Set).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.onGlobalMouseUp);
  }

  componentWillUpdate(nextProps) {
    if (this.props.selectedIds !== nextProps.selectedIds) {
      this.listRef.forceUpdateGrid();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onGlobalMouseUp);
  }

  onItemMouseDown = (id, index, event) => {
    this.mouseDown = true;

    if (event.ctrlKey || event.metaKey) {
      const { selectedIds } = this.props;

      this.savedSelectedIds = selectedIds;
      this.activeSelectStartIndex = index;
      this.activeSelectEndIndex = index;
      this.currentActionIsDeselect = selectedIds.has(id);

      this.updateSelectedIds();
    } else if (event.shiftKey) {
      this.savedSelectedIds = new Set();
      this.activeSelectStartIndex = this.activeSelectStartIndex !== null
        ? this.activeSelectStartIndex : index;
      this.activeSelectEndIndex = index;
      this.currentActionIsDeselect = false;

      this.updateSelectedIds();
    } else {
      this.savedSelectedIds = new Set();
      this.activeSelectStartIndex = index;
      this.activeSelectEndIndex = index;
      this.currentActionIsDeselect = false;

      this.updateSelectedIds();
    }
  };

  onItemMouseEnter = (id, index) => {
    if (this.mouseDown) {
      this.activeSelectEndIndex = index;
      this.updateSelectedIds();
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
        this.handleDownButton(event.shiftKey);
        break;

      case keyCodes.upArrow:
        event.preventDefault();
        this.handleUpButton(event.shiftKey);
        break;

      case keyCodes.a:
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();

          this.savedSelectedIds = this.props.selectedIds;
          this.activeSelectStartIndex = 0;
          this.activeSelectEndIndex = itemsCount - 1;
          this.currentActionIsDeselect = false;

          this.updateSelectedIds();
        }
        break;

      default:
        break;
    }
  };

  getSelectedIdsForUpdate() {
    if (this.activeSelectStartIndex === null || this.activeSelectEndIndex === null) {
      return new Set();
    }

    const { items } = this.props;
    const ids = [];

    const indexes = this.getSortedActiveSelectIndexes();

    let index = indexes.firstIndex;
    let item;
    while (index <= indexes.lastIndex) {
      item = items[index];
      if (!item.disabled) {
        ids.push(items[index].id);
      }
      index += 1;
    }

    return this.currentActionIsDeselect
      ? this.savedSelectedIds.subtract(ids)
      : this.savedSelectedIds.union(ids);
  }

  getSortedActiveSelectIndexes = () => (
    this.activeSelectStartIndex < this.activeSelectEndIndex ? {
      firstIndex: this.activeSelectStartIndex,
      lastIndex: this.activeSelectEndIndex,
    } : {
      firstIndex: this.activeSelectEndIndex,
      lastIndex: this.activeSelectStartIndex,
    }
  );

  setListRef = (ref) => {
    this.listRef = ref;
  };

  handleDownButton(shiftPressed) {
    let startIndex;
    let endIndex;

    if (this.activeSelectStartIndex === null) {
      endIndex = 0;
      startIndex = endIndex;
    } else {
      const { items } = this.props;
      const itemsCount = items.length;

      let needNext = true;
      endIndex = this.activeSelectEndIndex;

      while (needNext) {
        if (endIndex === itemsCount - 1) {
          needNext = false;
          endIndex = this.activeSelectEndIndex;
        } else {
          endIndex += 1;
          if (!items[endIndex].disabled) {
            needNext = false;
          }
        }
      }

      if (shiftPressed) {
        startIndex = this.activeSelectStartIndex;
      } else {
        startIndex = endIndex;
      }
    }

    this.activeSelectStartIndex = startIndex;
    this.activeSelectEndIndex = endIndex;
    this.currentActionIsDeselect = false;
    this.savedSelectedIds = shiftPressed ? this.savedSelectedIds : new Set();

    this.updateSelectedIds();
  }

  handleUpButton(shiftPressed) {
    const { items } = this.props;
    const itemsCount = items.length;

    let startIndex;
    let endIndex;

    if (this.activeSelectStartIndex === null) {
      endIndex = itemsCount - 1;
      startIndex = endIndex;
    } else {
      let needPrev = true;
      endIndex = this.activeSelectEndIndex;

      while (needPrev) {
        if (endIndex === 0) {
          needPrev = false;
          endIndex = this.activeSelectEndIndex;
        } else {
          endIndex -= 1;
          if (!items[endIndex].disabled) {
            needPrev = false;
          }
        }
      }

      if (shiftPressed) {
        startIndex = this.activeSelectStartIndex;
      } else {
        startIndex = endIndex;
      }
    }

    this.activeSelectStartIndex = startIndex;
    this.activeSelectEndIndex = endIndex;
    this.currentActionIsDeselect = false;
    this.savedSelectedIds = shiftPressed ? this.savedSelectedIds : new Set();

    this.updateSelectedIds();
  }

  updateSelectedIds() {
    this.props.onChange(this.getSelectedIdsForUpdate());
  }

  optionRenderer = ({ index, style }) => {
    const { items, selectedIds } = this.props;
    const item = items[index];

    return (
      <ProjectsSelectOption
        key={item.id}
        id={item.id}
        index={index}
        name={item.name}
        depth={item.depth}
        parentCustomSort={item.parentCustomSort}
        disabled={item.disabled}
        filterMatch={item.filterMatch}
        selected={selectedIds.has(item.id)}
        onMouseDown={this.onItemMouseDown}
        onMouseEnter={this.onItemMouseEnter}
        style={style}
      />
    );
  };

  savedSelectedIds = new Set();
  activeSelectStartIndex = null;
  activeSelectEndIndex = null;
  currentActionIsDeselect = false;
  mouseDown = false;

  render() {
    const { items } = this.props;
    const rowCount = items.length;

    return (
      <div
        className="projects-select"
        onKeyDown={this.onKeyDown}
        role="listbox"
        tabIndex={0}
      >
        <AutoSizer>
          {({ height, width }) => (
            <List
              className="projects-select__list"
              width={width}
              height={height}
              rowCount={rowCount}
              rowHeight={OPTION_HEIGHT}
              rowRenderer={this.optionRenderer}
              ref={this.setListRef}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}

export default ProjectsSelect;
