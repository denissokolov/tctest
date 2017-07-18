import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Set } from 'immutable';

import { changeVisibleSelectedProjects } from '../../../actions/ConfigureProjectsActions';

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

  render() {
    const { items, selectedIds, firstChangedIndex } = this.props;

    return (
      <ProjectsSelect
        items={items}
        selectedIds={selectedIds}
        firstChangedIndex={firstChangedIndex}
        onChange={this.onChange}
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
