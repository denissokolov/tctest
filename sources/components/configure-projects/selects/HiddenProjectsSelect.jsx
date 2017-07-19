import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Set } from 'immutable';

import {
  changeHiddenSelectedProjects, showProject, showProjects,
} from '../../../actions/ConfigureProjectsActions';

import keyCodes from '../../../utils/keyCodes';
import ProjectsSelect from './ProjectsSelect';

export class HiddenProjectsSelect extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedIds: PropTypes.instanceOf(Set).isRequired,
    firstChangedIndex: PropTypes.number,
    noScrollList: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    firstChangedIndex: undefined,
  };

  onChange = (selectedIds) => {
    this.props.dispatch(changeHiddenSelectedProjects(selectedIds));
  };

  onKeyDown = (event) => {
    switch (event.keyCode) {
      case keyCodes.s:
        if (event.ctrlKey) {
          event.preventDefault();
          this.props.dispatch(showProjects());
        }
        break;

      default:
        break;
    }
  };

  optionActionOnClick = (projectId) => {
    this.props.dispatch(showProject(projectId));
  };

  render() {
    const { items, selectedIds, firstChangedIndex, noScrollList } = this.props;

    return (
      <ProjectsSelect
        items={items}
        selectedIds={selectedIds}
        firstChangedIndex={firstChangedIndex}
        noScrollList={noScrollList}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        optionActionText="show"
        optionActionOnClick={this.optionActionOnClick}
      />
    );
  }
}

const mapStateToProps = state => ({
  items: state.configureProjects.get('hiddenItems'),
  selectedIds: state.configureProjects.get('hiddenSelectedIds'),
  firstChangedIndex: state.configureProjects.get('firstChangedHiddenIndex'),
  noScrollList: state.configureProjects.get('noScrollHiddenList'),
});

export default connect(mapStateToProps)(HiddenProjectsSelect);
