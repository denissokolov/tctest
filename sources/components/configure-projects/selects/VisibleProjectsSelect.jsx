import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Set } from 'immutable';

import { changeVisibleSelectedProjects, hideProject } from '../../../actions/ConfigureProjectsActions';

import ProjectsSelect from './ProjectsSelect';

class VisibleProjectsSelect extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedIds: PropTypes.instanceOf(Set).isRequired,
    firstChangedIndex: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    firstChangedIndex: undefined,
  };

  onChange = (selectedIds) => {
    this.props.dispatch(changeVisibleSelectedProjects(selectedIds));
  };

  optionActionOnClick = (projectId) => {
    this.props.dispatch(hideProject(projectId));
  };

  render() {
    const { items, selectedIds, firstChangedIndex } = this.props;

    return (
      <ProjectsSelect
        items={items}
        selectedIds={selectedIds}
        firstChangedIndex={firstChangedIndex}
        onChange={this.onChange}
        optionActionText="hide"
        optionActionOnClick={this.optionActionOnClick}
      />
    );
  }
}

const mapStateToProps = state => ({
  items: state.configureProjects.get('visibleItems'),
  selectedIds: state.configureProjects.get('visibleSelectedIds'),
  firstChangedIndex: state.configureProjects.get('firstChangedVisibleIndex'),
});

export default connect(mapStateToProps)(VisibleProjectsSelect);
