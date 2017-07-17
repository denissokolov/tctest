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
    dispatch: PropTypes.func.isRequired,
  };

  onChange = (selectedIds) => {
    this.props.dispatch(changeHiddenSelectedProjects(selectedIds));
  };

  render() {
    const { items, selectedIds } = this.props;

    return (
      <ProjectsSelect
        items={items}
        selectedIds={selectedIds}
        onChange={this.onChange}
      />
    );
  }
}

const mapStateToProps = state => ({
  items: state.configureProjects.get('hiddenItems'),
  selectedIds: state.configureProjects.get('hiddenSelectedIds'),
});

export default connect(mapStateToProps)(HiddenProjectsSelect);
