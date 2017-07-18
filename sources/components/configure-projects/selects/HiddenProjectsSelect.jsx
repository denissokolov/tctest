import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Set } from 'immutable';

import { changeHiddenSelectedProjects } from '../../../actions/ConfigureProjectsActions';

import ProjectsSelect from './ProjectsSelect';

export class HiddenProjectsSelect extends React.Component {
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
    this.props.dispatch(changeHiddenSelectedProjects(selectedIds));
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
  items: state.configureProjects.get('hiddenItems'),
  selectedIds: state.configureProjects.get('hiddenSelectedIds'),
  firstChangedIndex: state.configureProjects.get('firstChangedHiddenIndex'),
});

export default connect(mapStateToProps)(HiddenProjectsSelect);
